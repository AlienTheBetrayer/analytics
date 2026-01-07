import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const ProjectManipulation = () => {
    // zustand states
    const status = useAppStore((state) => state.status);
    const promises = useAppStore((state) => state.promises);
    const events = useAppStore((state) => state.events);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // zustand functions
    const deleteData = useAppStore((state) => state.deleteData);

    // messageboxes
    const deleteProjectBox = usePopup(({ hide }) => (
        <MessageBox
            description="You will delete every single data entry about this project, including events, aggregates!"
            onInteract={(res) => {
                hide();
                if (!selectedProjectId) {
                    return;
                }

                if (res === "yes") {
                    deleteData({
                        id: [selectedProjectId],
                        type: "project",
                        promiseKey: `projectDelete_${selectedProjectId}`,
                    });
                }
            }}
        />
    ));

    const deleteEventsBox = usePopup(({ hide }) => (
        <MessageBox
            description="You will delete every single event in this project!"
            onInteract={(res) => {
                hide();
                if (!selectedProjectId || !events[selectedProjectId]) {
                    return;
                }

                if (res === "yes") {
                    deleteData({
                        id: events[selectedProjectId].map((e) => e.id),
                        type: "event",
                        promiseKey: `eventsDelete_${selectedProjectId}`,
                    });
                }
            }}
        />
    ));

    return (
        <div className="flex flex-col box w-screen! max-w-sm! gap-4!">
            {deleteProjectBox.render()}
            {deleteEventsBox.render()}

            <div className="flex flex-col gap-1 items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cube.svg"
                />
                <span className="text-5! text-foreground-5!">
                    Project manipulation
                </span>
                <p className="whitespace-normal text-center">
                    Alter this project&apos;s data in every way you could have
                    imagined
                </p>
            </div>
            <hr />

            <Tooltip
                text="Go to emulate page"
                direction="top"
                className="w-full"
                isEnabled={status?.role !== "user"}
            >
                <LinkButton
                    className="w-full"
                    href={`/dashboard/emulate/${selectedProjectId}`}
                    isEnabled={status?.role !== "user"}
                >
                    <Image
                        src="/emulate.svg"
                        width={16}
                        height={16}
                        alt=""
                    />
                    Emulate events
                </LinkButton>
            </Tooltip>

            <hr />

            <ul className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 items-center">
                    <span>
                        <u>Data wiping</u>
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row *:w-full ">
                    <li>
                        <Tooltip
                            text="Wipe all of this project's data"
                            className="w-full"
                            isEnabled={status?.role !== "user"}
                        >
                            <Button
                                className="w-full"
                                onClick={() => {
                                    deleteProjectBox.show();
                                }}
                                isEnabled={status?.role !== "user"}
                            >
                                {promiseStatus(
                                    promises[
                                        `projectDelete_${selectedProjectId}`
                                    ]
                                )}
                                <Image
                                    src="/delete.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                />
                                Delete project
                            </Button>
                        </Tooltip>
                    </li>
                    <li>
                        <Tooltip
                            text="Wipe this project's events"
                            className="w-full"
                            isEnabled={status?.role !== "user"}
                        >
                            <Button
                                className="w-full"
                                onClick={() => {
                                    deleteEventsBox.show();
                                }}
                                isEnabled={status?.role !== "user"}
                            >
                                {promiseStatus(
                                    promises[
                                        `eventsDelete_${selectedProjectId}`
                                    ]
                                )}
                                <Image
                                    src="/type.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                />
                                Delete all events
                            </Button>
                        </Tooltip>
                    </li>
                </div>
            </ul>
        </div>
    );
};

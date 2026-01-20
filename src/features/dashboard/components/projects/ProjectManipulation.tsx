import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { CloseButton } from "@/features/ui/closebutton/components/CloseButton";

type Props = {
    hide: () => void;
};

export const ProjectManipulation = ({ hide }: Props) => {
    // zustand states
    const promises = useAppStore((state) => state.promises);
    const events = useAppStore((state) => state.events);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // zustand functions
    const deleteData = useAppStore((state) => state.deleteData);

    // messageboxes
    const deleteProjectsBox = useMessageBox();
    const deleteEventsBox = useMessageBox();

    return (
        <div className="relative flex flex-col box w-screen! max-w-md! gap-4!">
            <CloseButton hide={hide} />

            {deleteProjectsBox.render({
                children:
                    "You will delete every single data entry about this project, including events!",
                onSelect: (res) => {
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
                },
            })}

            {deleteEventsBox.render({
                children: "You will delete every single event in this project!",
                onSelect: (res) => {
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
                },
            })}

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

            <LinkButton
                className="w-full"
                href={`/emulate/${selectedProjectId}`}
            >
                <Image
                    src="/emulate.svg"
                    width={16}
                    height={16}
                    alt=""
                />
                Emulate events
            </LinkButton>

            <hr />

            <ul className="flex flex-col gap-2">
                <li className="flex flex-col gap-2 items-center">
                    <span>
                        <u>Data wiping</u>
                    </span>
                </li>

                <li>
                    <ul className="flex flex-col sm:flex-row *:w-full gap-4">
                        <li>
                            <Button
                                className="w-full"
                                onClick={() => {
                                    deleteProjectsBox.show();
                                }}
                            >
                                <PromiseStatus
                                    status={
                                        promises[
                                            `projectDelete_${selectedProjectId}`
                                        ]
                                    }
                                />
                                <Image
                                    src="/delete.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                />
                                Delete project
                            </Button>
                        </li>

                        <li>
                            <Button
                                className="w-full"
                                onClick={() => {
                                    deleteEventsBox.show();
                                }}
                            >
                                <PromiseStatus
                                    status={
                                        promises[
                                            `eventsDelete_${selectedProjectId}`
                                        ]
                                    }
                                />
                                <Image
                                    src="/type.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                />
                                Delete all events
                            </Button>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};

import { MessageBox } from "@/features/ui/messagebox/components/MessageBox";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { useState } from "react";

export const ProjectManipulation = () => {
    // zustand states
    const promises = useAppStore((state) => state.promises);
    const events = useAppStore((state) => state.events);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // zustand functions
    const deleteData = useAppStore((state) => state.deleteData);

    // messageboxes
    const [boxVisibility, setBoxVisibility] = useState<{
        events: boolean;
        projects: boolean;
    }>({ events: false, projects: false });

    return (
        <div className="flex flex-col box w-screen! max-w-md! gap-4!">
            <MessageBox
                visibility={boxVisibility.projects}
                onSelect={(res) => {
                    setBoxVisibility((prev) => ({ ...prev, projects: false }));

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
            >
                You will delete every single data entry about this project,
                including events!
            </MessageBox>

            <MessageBox
                visibility={boxVisibility.events}
                onSelect={(res) => {
                    setBoxVisibility((prev) => ({ ...prev, events: false }));

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
            >
                You will delete every single event in this project!
            </MessageBox>

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
                                    setBoxVisibility((prev) => ({
                                        ...prev,
                                        projects: true,
                                    }));
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
                                    setBoxVisibility((prev) => ({
                                        ...prev,
                                        events: true,
                                    }));
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

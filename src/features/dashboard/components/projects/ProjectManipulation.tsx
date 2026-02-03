import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { CloseButton } from "@/features/ui/closebutton/components/CloseButton";
import { wrapPromise } from "@/promises/core";
import { PromiseState } from "@/promises/components/PromiseState";
import { useQuery } from "@/query/core";
import {
    dashboardDeleteProject,
    dashboardDeleteEvents,
} from "@/query-api/calls/dashboard";

type Props = {
    hide: () => void;
};

export const ProjectManipulation = ({ hide }: Props) => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // message boxes
    const deleteEventsBox = useMessageBox();
    const deleteProjectsBox = useMessageBox();

    // fetching
    const { data } = useQuery({ key: ["projects"] });

    return (
        <div className="relative flex flex-col box w-screen! max-w-md! gap-4!">
            <CloseButton hide={hide} />

            {deleteProjectsBox.render({
                children:
                    "You will delete every single data entry about this project, including events!",
                onSelect: (res) => {
                    if (!selectedProjectId || !data?.[selectedProjectId]) {
                        return;
                    }

                    if (res === "yes") {
                        wrapPromise("deleteProject", () => {
                            return dashboardDeleteProject({
                                project: data[selectedProjectId],
                            });
                        });
                    }
                },
            })}

            {deleteEventsBox.render({
                children: "You will delete every single event in this project!",
                onSelect: (res) => {
                    if (!selectedProjectId || !data?.[selectedProjectId]) {
                        return;
                    }

                    if (res === "yes") {
                        wrapPromise("deleteEvents", () => {
                            return dashboardDeleteEvents({
                                project: data[selectedProjectId],
                            });
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
                                <PromiseState state="deleteProject" />
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
                                <PromiseState state="deleteEvents" />
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

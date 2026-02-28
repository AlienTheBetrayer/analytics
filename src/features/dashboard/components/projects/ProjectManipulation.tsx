import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { wrapPromise } from "@/promises/core";
import { PromiseState } from "@/promises/components/PromiseState";
import { useQuery } from "@/query/core";
import {
    dashboardDeleteProject,
    dashboardDeleteEvents,
} from "@/query-api/calls/dashboard";

export const ProjectManipulation = () => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // message boxes
    const deleteEventsBox = useMessageBox();
    const deleteProjectsBox = useMessageBox();

    // fetching
    const { data } = useQuery({ key: ["projects"] });

    return (
        <div className="relative flex flex-col box acrylic w-full gap-8!">
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
                <span className="text-5!">Project manipulation</span>
                <p className="whitespace-normal text-center">
                    Add new events or projects or remove existing ones
                </p>
            </div>

            <ul className="flex flex-col gap-2">
                <li>
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
                </li>

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
        </div>
    );
};

import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { wrapPromise } from "@/promises/core";
import { PromiseState } from "@/promises/components/PromiseState";
import { useQuery } from "@/query/core";
import { dashboardDeleteProject, dashboardDeleteEvents } from "@/query-api/calls/dashboard";

export const ProjectManipulation = () => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // message boxes
    const deleteEventsBox = useMessageBox();
    const deleteProjectsBox = useMessageBox();

    // fetching
    const { data } = useQuery({ key: ["projects"] });

    return (
        <div className="relative flex flex-col box acrylic w-full gap-4! p-4! items-center">
            {deleteProjectsBox.render({
                children: "You will delete every single data entry about this project, including events!",
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

            <div className="flex flex-col gap-1 items-center mb-4!">
                <span className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/cube.svg"
                    />
                </span>
                <span>Project manipulation</span>
            </div>

            <ul className="grid grid-cols-3 gap-0 sm:gap-2 w-full max-w-96">
                <li>
                    <LinkButton
                        className="flex-col w-full aspect-square rounded-4xl!"
                        href={`/emulate/${selectedProjectId}`}
                    >
                        <span className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-blue-1"/>
                            <Image
                                src="/emulate.svg"
                                width={16}
                                height={16}
                                alt=""
                            />
                        </span>
                        <span className="truncate">Emulate</span>
                    </LinkButton>
                </li>

                <li>
                    <Button
                        className="flex-col w-full aspect-square rounded-4xl!"
                        onClick={() => {
                            deleteProjectsBox.show();
                        }}
                    >
                        <span className="flex items-center gap-1">
                            <PromiseState state="deleteProject" />
                            <div className="w-1 h-1 rounded-full bg-orange-1"/>
                            <Image
                                src="/delete.svg"
                                width={16}
                                height={16}
                                alt=""
                            />
                        </span>
                        <span className="truncate">Delete project</span>
                    </Button>
                </li>

                <li>
                    <Button
                        className="flex-col w-full aspect-square rounded-4xl!"
                        onClick={() => {
                            deleteEventsBox.show();
                        }}
                    >
                        <span className="flex items-center gap-1">
                            <PromiseState state="deleteEvents" />
                            <div className="w-1 h-1 rounded-full bg-red-1"/>
                            <Image
                                src="/type.svg"
                                width={16}
                                height={16}
                                alt=""
                            />
                        </span>
                        <span className="truncate">Delete events</span>
                    </Button>
                </li>
            </ul>
        </div>
    );
};

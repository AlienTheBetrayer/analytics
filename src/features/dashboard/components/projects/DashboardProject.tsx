import "./DashboardProject.css";
import Image from "next/image";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import type { ProjectData } from "@/types/zustand/data";
import { relativeTime } from "@/utils/relativeTime";
import { useAppStore } from "@/zustand/store";
import { promiseStatus } from "@/utils/status";

type Props = {
    projectData: ProjectData;
};

export const DashboardProject = ({ projectData }: Props) => {
    // zustand state
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const promises = useAppStore((state) => state.promises);
    const status = useAppStore((state) => state.status);

    // zustand functions
    const selectProject = useAppStore((state) => state.selectProject);
    const deleteProject = useAppStore((state) => state.deleteProject);

    if (!projectData.project) {
        return null;
    }

    return (
        <li className="w-full">
            <Tooltip
                title={`${projectData.project.name}'s actions`}
                text="Specific to this project"
                direction="top"
                className="w-full"
                type="modal"
                disabledPointer={false}
                element={
                    <div className="flex flex-col gap-1 box">
                        <Tooltip
                            text="Delete this project"
                            direction="right"
                            className="w-full"
                            isEnabled={status?.role !== "user"}
                        >
                            <Button
                                className="w-full"
                                onClick={() => {
                                    deleteProject(projectData.project.id);
                                }}
                                isEnabled={status?.role !== "user"}
                            >
                                {promiseStatus(promises.project_delete)}
                                <Image
                                    src="/cross.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                />
                                Delete
                            </Button>
                        </Tooltip>

                        <Tooltip
                            text="Go to emulate page"
                            direction="right"
                            className="w-full"
                            isEnabled={status?.role !== "user"}
                        >
                            <LinkButton
                                className="w-full"
                                href={`/dashboard/emulate/${projectData.project.id}`}
                                isEnabled={status?.role !== "user"}
                            >
                                <Image
                                    src="/emulate.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                />
                                Emulate
                            </LinkButton>
                        </Tooltip>
                    </div>
                }
            >
                <Tooltip className='w-full' text={projectData.project.name} direction="top">
                    <Button
                        className={`relative w-full px-4! py-2! sm:h-16! project-button ${projectData.project.id === selectedProjectId ? "border-blue-1!" : ""}`}
                        onClick={() => {
                            selectProject(projectData.project?.id ?? undefined);
                        }}
                    >
                        <div className="flex items-center gap-1.5">
                            {promiseStatus(promises.project)}
                            <Image
                                src="/link.svg"
                                alt=""
                                width={16}
                                height={16}
                            />
                            <span>{projectData.project.name}</span>
                        </div>

                        <div className="flex sm:flex-col justify-between w-full h-full items-end">
                            <span>
                                created{" "}
                                {relativeTime(projectData.project.created_at)}
                            </span>
                            <span>
                                updated{" "}
                                {relativeTime(
                                    projectData.project.last_event_at
                                )}
                            </span>
                        </div>

                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3!">
                            <small>{projectData.events?.length}</small>
                        </span>
                    </Button>
                </Tooltip>
            </Tooltip>
        </li>
    );
};

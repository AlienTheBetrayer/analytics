import "./DashboardProject.css";
import Image from "next/image";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { usePromiseStatus } from "@/hooks/usePromiseStatus";
import type { ProjectData } from "@/types/zustand/data";
import { relativeTime } from "@/utils/relativeTime";
import { useAppStore } from "@/zustand/store";

type Props = {
    projectData: ProjectData;
};

export const DashboardProject = ({ projectData }: Props) => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const selectProject = useAppStore((state) => state.selectProject);

    // spinner handling
    const promises = usePromiseStatus();

    if (!projectData.project) return null;

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
                        <Tooltip text="Delete this project" direction="right" className="w-full">
                            <Button className="w-full">
                                <Image src="/cross.svg" width={16} height={16} alt="" />
                                Delete
                            </Button>
                        </Tooltip>

                        <Tooltip text="Go to emulate page" direction="right" className="w-full">
                            <LinkButton
                                className="w-full"
                                href={`/dashboard/emulate/${projectData.project.id}`}
                            >
                                <Image src="/emulate.svg" width={16} height={16} alt="" />
                                Emulate
                            </LinkButton>
                        </Tooltip>
                    </div>
                }
            >
                <Button
                    className={`w-full px-4! py-2! sm:h-16! project-button ${projectData.project.id === selectedProjectId ? "border-blue-1!" : ""}`}
                    onClick={() => {
                        selectProject(projectData.project?.id ?? undefined);
                    }}
                >
                    <div className="flex items-center gap-1.5">
                        {promises.get("project") === "pending" && <Spinner />}
                        <Image src="/link.svg" alt="" width={16} height={16} />
                        <span>{projectData.project.name}</span>
                    </div>

                    <div className="flex sm:flex-col justify-evenly sm:justify-between w-full h-full items-end">
                        <span>{relativeTime(projectData.project.created_at)}</span>
                        <span>{relativeTime(projectData.project.last_event_at)}</span>
                    </div>
                </Button>
            </Tooltip>
        </li>
    );
};

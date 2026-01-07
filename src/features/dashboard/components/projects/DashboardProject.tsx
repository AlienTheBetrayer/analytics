import "./DashboardProject.css";
import Image from "next/image";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { relativeTime } from "@/utils/other/relativeTime";
import { useAppStore } from "@/zustand/store";
import { promiseStatus } from "@/utils/other/status";

type Props = {
    id: string;
};

export const DashboardProject = ({ id }: Props) => {
    // zustand state
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const promises = useAppStore((state) => state.promises);
    const projects = useAppStore((state) => state.projects);
    const events = useAppStore((state) => state.events);
    const aggregates = useAppStore((state) => state.aggregates);

    // zustand functions
    const selectProject = useAppStore((state) => state.selectProject);

    // state-derived ui states
    const data = {
        project: projects[id],
        events: events[id],
        aggregates: aggregates[id],
    };

    if (!data.project) {
        return <span>No project data loaded yet.</span>;
    }

    return (
        <li className="w-full">
            <Tooltip
                className="w-full"
                text={data.project.name}
                direction="top"
            >
                <Button
                    className={`relative w-full px-4! py-2! sm:h-16! project-button ${data.project.id === selectedProjectId ? "border-blue-1!" : ""}`}
                    onClick={() => {
                        selectProject(data.project?.id ?? undefined);
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
                        <span>{data.project.name}</span>
                    </div>

                    <div className="flex sm:flex-col flex-wrap justify-between w-full h-full items-end ">
                        <span>
                            created {relativeTime(data.project.created_at)}
                        </span>
                        <span>
                            updated {relativeTime(data.project.last_event_at)}
                        </span>
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-8">
                        <span className="text-3!">
                            <small>{data.events?.length}</small>
                            <small className="text-6!">events</small>
                        </span>
                        <span className="text-3!">
                            <small>{data.aggregates?.visits ?? 0}</small>
                            <small className="text-6!">visits</small>
                        </span>
                    </div>
                </Button>
            </Tooltip>
        </li>
    );
};

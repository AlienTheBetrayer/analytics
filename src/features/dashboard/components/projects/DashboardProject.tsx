import "./DashboardProject.css";
import Image from "next/image";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { relativeTime } from "@/utils/other/relativeTime";
import { useAppStore } from "@/zustand/store";
import { promiseStatus } from "@/utils/other/status";
import { useMemo } from "react";

type Props = {
    id: string;
};

export const DashboardProject = ({ id }: Props) => {
    // zustand state
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const promises = useAppStore((state) => state.promises);
    const projects = useAppStore((state) => state.projects);
    const events = useAppStore((state) => state.events);

    // zustand functions
    const selectProject = useAppStore((state) => state.selectProject);

    // state-derived ui states
    const pageViewEvents = useMemo(() => {
        return (
            events[id]?.reduce(
                (acc, val) => (val.type === "page_view" ? acc + 1 : acc),
                0,
            ) ?? 0
        );
    }, [events, id]);

    return (
        <li className="w-full">
            <Tooltip
                className="w-full"
                text={projects[id].name}
                direction="top"
            >
                <Button
                    className={`relative rounded-4xl! w-full px-4! py-2! sm:h-16! project-button justify-between! items-center duration-300! 
                        ${id === selectedProjectId ? "border-blue-1!" : ""}`}
                    onClick={() => {
                        selectProject(id ?? undefined);
                    }}
                >
                    <div className="flex items-center gap-1">
                        {promiseStatus(promises.project)}
                        <Image
                            src="/cube.svg"
                            alt=""
                            width={16}
                            height={16}
                        />
                        <span className="text-6! text-foreground-4!">
                            {projects[id]?.name}
                        </span>
                    </div>

                    <div className="grid grid-flow-col place-items-center gap-2">
                        <span className="flex gap-1 items-center ">
                            <Image
                                src="/plus.svg"
                                alt="created"
                                width={16}
                                height={16}
                            />
                            {relativeTime(projects[id]?.created_at)}
                        </span>

                        <hr className="w-px! h-4/5!" />

                        <span className="flex gap-1 items-center">
                            <Image
                                src="/pencil.svg"
                                alt="updated"
                                width={16}
                                height={16}
                            />
                            {relativeTime(projects[id]?.last_event_at)}
                        </span>
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4">
                        <span className="flex gap-1 items-center text-4!">
                            <small>{events[id]?.length}</small>
                            <small className="text-6!">events</small>
                        </span>

                        <span className="flex gap-1 items-center text-4!">
                            <small>{pageViewEvents}</small>
                            <small className="text-6!">visits</small>
                        </span>
                    </div>
                </Button>
            </Tooltip>
        </li>
    );
};

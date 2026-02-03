import "./DashboardProject.css";
import Image from "next/image";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { relativeTime } from "@/utils/other/relativeTime";
import { useAppStore } from "@/zustand/store";
import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    data: CacheAPIProtocol["projects"]["data"][keyof CacheAPIProtocol["projects"]["data"]];
};

export const DashboardProject = ({ data }: Props) => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const selectProject = useAppStore((state) => state.selectProject);

    return (
        <li className="w-full">
            <Tooltip
                className="w-full"
                text={data.name}
                direction="top"
            >
                <Button
                    className={`relative rounded-4xl! w-full px-4! py-2! sm:h-16! project-button justify-between! items-center duration-300! 
                        ${data.id === selectedProjectId ? "border-blue-1!" : ""}`}
                    onClick={() => {
                        selectProject(
                            data.id !== selectedProjectId ? data.id : undefined,
                        );
                    }}
                >
                    <div className="flex items-center gap-1">
                        <Image
                            src="/cube.svg"
                            alt=""
                            width={16}
                            height={16}
                        />
                        <span className="text-6! text-foreground-4!">
                            {data.name}
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
                            {relativeTime(data.created_at)}
                        </span>

                        <hr className="w-px! h-4/5!" />

                        <span className="flex gap-1 items-center">
                            <Image
                                src="/pencil.svg"
                                alt="updated"
                                width={16}
                                height={16}
                            />
                            {relativeTime(data.last_event_at)}
                        </span>
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4">
                        <span className="flex gap-1 items-center text-4!">
                            <small>{data.event_count}</small>
                            <small className="text-6!">events</small>
                        </span>
                    </div>
                </Button>
            </Tooltip>
        </li>
    );
};

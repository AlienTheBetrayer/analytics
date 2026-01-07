"use client";
import { useAppStore } from "@/zustand/store";
import { Spinner } from "../../spinner/components/Spinner";
import { useData } from "../hooks/useData";
import { DashboardEvents } from "./events/DashboardEvents";
import { DashboardProjects } from "./projects/DashboardProjects";
import { Topline } from "./Topline";
import Image from "next/image";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Button } from "@/features/ui/button/components/Button";
import { promiseStatus } from "@/utils/other/status";

export const Dashboard = () => {
    // zustand states
    const promises = useAppStore((state) => state.promises);
    const status = useAppStore((state) => state.status);
    const projects = useAppStore((state) => state.projects);

    // zustand functions
    const sync = useAppStore((state) => state.sync);

    // helper hook to initialize zustand's requests
    useData();

    return (
        <div
            className="w-full max-w-7xl m-auto min-h-200 mt-8 sm:mt-0 box"
        >
            <Topline />
            <hr className="w-5/6! mx-auto!" />

            {status ? (
                !Object.values(projects)?.length ? (
                    <div className="flex flex-col items-center justify-center grow">
                        <div className="flex flex-col gap-4 items-center">
                            <div className="flex flex-col gap-1 items-center">
                                <div className="relative flex gap-1">
                                    <Image
                                        width={20}
                                        height={20}
                                        alt=""
                                        src="/privacy.svg"
                                    />
                                </div>

                                <span className="text-5! text-foreground-5!">
                                    <u>Absent</u> data
                                </span>

                                <p className="max-w-100 text-center">
                                    Currently there is no data stored in the
                                    database. You can try <b>re-fetching</b> to
                                    ensure the availability of the{" "}
                                    <mark>data</mark> at the moment.
                                </p>
                            </div>

                            <hr />
                            <div className="flex flex-col gap-1 items-center w-full">
                                <Tooltip
                                    text="Re-sync data"
                                    className="w-full"
                                >
                                    <Button
                                        className='w-full'
                                        onClick={() => {
                                            sync({ promiseKey: "syncNoData" });
                                        }}
                                    >
                                        {promiseStatus(promises.syncNoData)}
                                        <Image
                                            width={16}
                                            height={16}
                                            alt=""
                                            src="/download.svg"
                                        />
                                        Fetch attempt
                                    </Button>
                                </Tooltip>

                                <Tooltip
                                    text="Emulate synthetic events"
                                    className="w-full"
                                >
                                    <LinkButton href="/dashboard/emulate">
                                        <Image
                                            width={16}
                                            height={16}
                                            alt=""
                                            src="/pencil.svg"
                                        />
                                        Synthesize events
                                    </LinkButton>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-flow-row lg:grid-flow-col lg:grid-cols-2 gap-4 grow">
                        <DashboardProjects />
                        <DashboardEvents />
                    </div>
                )
            ) : (
                <div className="m-auto flex flex-col items-center justify-center grow">
                    <span>Authentication is required to see data.</span>
                    <Spinner styles="big" />
                </div>
            )}
        </div>
    );
};

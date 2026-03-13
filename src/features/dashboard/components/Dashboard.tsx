"use client";
import { useAppStore } from "@/zustand/store";
import { DashboardEvents } from "./events/DashboardEvents";
import { DashboardProjects } from "./projects/DashboardProjects";
import { Topline } from "./Topline";
import { LoadingDashboard } from "@/features/ui/loading/components/LoadingDashboard";
import { AbsentTopline } from "@/features/ui/loading/components/AbsentTopline";
import { EventTopline } from "@/features/dashboard/components/topline/events/EventTopline";
import { NoProjectSelected } from "@/features/dashboard/components/errors/NoProjectSelected";
import { ProjectTopline } from "@/features/dashboard/components/topline/projects/ProjectTopline";
import { useQuery } from "@/query/core";
import { Spinner } from "@/features/ui/spinner/components/Spinner";

export const Dashboard = () => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data, isLoading } = useQuery({ key: ["projects"] });

    // fallbacks
    let errorString = "";

    if (!status || status.role === "user") {
        errorString = "Not authenticated";
    }

    if (isLoading) {
        errorString = "Loading...";
    }

    if (!data) {
        errorString = "Data is absent";
    }

    if (errorString) {
        return (
            <>
                <AbsentTopline title={errorString} />
                <div className="w-full max-w-400 m-auto min-h-200 box">
                    <LoadingDashboard />
                    <Spinner className="absolute left-1/2 top-1/2 -translate-1/2" />
                </div>
            </>
        );
    }

    return (
        <>
            <Topline />

            <div className="w-full max-w-400 m-auto min-h-200 box gap-4! p-1! sm:p-4!">
                <div className="flex flex-col lg:flex-row gap-4 grow *:w-full">
                    <div className="flex flex-col gap-4 relative max-h-256">
                        <ProjectTopline />
                        {data && <DashboardProjects data={data} />}
                    </div>

                    <hr className="lg:hidden" />

                    <div className="flex flex-col gap-4 max-h-256 relative">
                        <EventTopline />
                        {selectedProjectId ?
                            <DashboardEvents id={selectedProjectId} />
                        :   <div className="rounded-4xl loading p-4! grow items-center justify-center flex">
                                <NoProjectSelected />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

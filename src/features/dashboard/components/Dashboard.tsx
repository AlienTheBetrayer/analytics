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

export const Dashboard = () => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data, isLoading } = useQuery({ key: ["projects"] });

    // fallbacks
    let errorString = "";

    if (!status) {
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
                </div>
            </>
        );
    }

    return (
        <>
            <Topline />
            <div className="w-full max-w-400 m-auto min-h-200 box gap-3!">
                <hr />

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-4 grow *:w-full">
                    <div className="flex flex-col gap-3 relative max-h-256">
                        <ProjectTopline />
                        <hr />
                        {data && <DashboardProjects data={data} />}
                    </div>

                    <hr className="lg:hidden" />

                    <div className="flex flex-col gap-3 max-h-256 relative">
                        <EventTopline />
                        <hr />
                        {selectedProjectId ? (
                            <DashboardEvents id={selectedProjectId} />
                        ) : (
                            <NoProjectSelected />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

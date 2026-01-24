"use client";
import { useAppStore } from "@/zustand/store";
import { DashboardEvents } from "./events/DashboardEvents";
import { DashboardProjects } from "./projects/DashboardProjects";
import { Topline } from "./Topline";
import { useEffect, useRef } from "react";
import { LoadingDashboard } from "@/features/ui/loading/components/LoadingDashboard";
import { AbsentTopline } from "@/features/ui/loading/components/AbsentTopline";

export const Dashboard = () => {
    // zustand states
    const status = useAppStore((state) => state.status);
    const projects = useAppStore((state) => state.projects);

    // zustand functions
    const deleteState = useAppStore((state) => state.deleteState);
    const selectProject = useAppStore((state) => state.selectProject);
    const sync = useAppStore((state) => state.sync);

    const hasFetched = useRef<boolean>(false);

    // fetching
    useEffect(() => {
        if (!status) {
            hasFetched.current = false;
            deleteState();
            selectProject(undefined);
        } else {
            if (hasFetched.current) {
                return;
            }
            hasFetched.current = true;
            sync();
        }
    }, [status, deleteState, selectProject, sync]);

    // fallback
    let errorString = "";

    if (!status) {
        errorString = "Not authenticated";
    }

    if (!Object.values(projects)?.length) {
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
                    <DashboardProjects />
                    <hr className="lg:hidden" />
                    <DashboardEvents />
                </div>
            </div>
        </>
    );
};

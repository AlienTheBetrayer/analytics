"use client";
import { useAppStore } from "@/zustand/store";
import { DashboardEvents } from "./events/DashboardEvents";
import { DashboardProjects } from "./projects/DashboardProjects";
import { Topline } from "./Topline";
import { AbsentData } from "./errors/AbsentData";
import { AuthRequired } from "@/features/authentication/components/AuthRequired";
import { useEffect, useRef } from "react";

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

    if (!status) {
        return (
            <div className="w-full max-w-400 m-auto min-h-200 mt-8 sm:mt-0 box">
                <AuthRequired />
            </div>
        );
    }

    if (!Object.values(projects)?.length) {
        return (
            <div className="w-full max-w-400 m-auto min-h-200 mt-8 sm:mt-0 box">
                <AbsentData />
            </div>
        );
    }

    return (
        <>
            <Topline />
            <div className="w-full max-w-400 m-auto min-h-200 box gap-3!">
                <hr />

                <div className="flex flex-col md:flex-row gap-8 md:gap-4 grow *:w-full">
                    <DashboardProjects />
                    <hr className="md:hidden" />
                    <DashboardEvents />
                </div>
            </div>
        </>
    );
};

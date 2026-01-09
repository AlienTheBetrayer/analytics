"use client";
import { useAppStore } from "@/zustand/store";
import { useData } from "../hooks/useData";
import { DashboardEvents } from "./events/DashboardEvents";
import { DashboardProjects } from "./projects/DashboardProjects";
import { Topline } from "./Topline";
import { AbsentData } from "./errors/AbsentData";
import { AuthRequired } from "@/features/authentication/components/AuthRequired";

export const Dashboard = () => {
    // zustand states

    const status = useAppStore((state) => state.status);
    const projects = useAppStore((state) => state.projects);

    // helper hook to initialize zustand's requests
    useData();

    if (!status) {
        return (
            <div className="w-full max-w-7xl m-auto min-h-200 mt-8 sm:mt-0 box">
                <AuthRequired />
            </div>
        );
    }

    if (!Object.values(projects)?.length) {
        return (
            <div className="w-full max-w-7xl m-auto min-h-200 mt-8 sm:mt-0 box">
                <AbsentData />
            </div>
        );
    }

    return (
        <>
            <Topline />
            <div className="w-full max-w-7xl m-auto min-h-200 mt-8 sm:mt-0 box gap-3!">
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

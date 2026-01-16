"use client";
import { useParams } from "next/navigation";
import { useAppStore } from "@/zustand/store";
import { Controller } from "./Controller";
import { FetchPrompt } from "./FetchPrompt";
import { ProjectList } from "./ProjectList";
import { Topline } from "./Topline";
import { LoadingEmulate } from "@/features/loading/components/LoadingEmulate";

export const Emulate = () => {
    // url
    const { id } = useParams<{ id: string | undefined }>();

    // zustand states
    const projects = useAppStore((state) => state.projects);
    const status = useAppStore((state) => state.status);

    // error handling:
    // authentcation's missing
    if (!status || status?.role === "user") {
        return (
            <div className="flex flex-col w-full max-w-400 p-6! rounded-4xl! gap-4! m-auto box">
                <LoadingEmulate />
            </div>
        );
    }

    // no data fetched
    if (!projects) {
        return (
            <div className="flex flex-col w-full mt-16 max-w-400 p-6! rounded-4xl! gap-4! m-auto box">
                <FetchPrompt />
            </div>
        );
    }

    // data is fetched and project at the id is not fetched
    if (id && !projects[id]) {
        return (
            <div className="flex flex-col w-full max-w-400 m-auto box p-6! rounded-4xl!">
                <FetchPrompt />
                <hr />
                <ProjectList />
            </div>
        );
    }

    return (
        <>
            <Topline />
            <div className="flex flex-col w-full max-w-400 p-6! rounded-4xl! gap-4! box m-auto">
                <div className="flex flex-col gap-2">
                    {!Object.values(projects).length ? (
                        <>
                            <span className="text-center text-foreground-2! text-5! whitespace-nowrap">
                                <u>No project data</u>
                            </span>
                            <span className="text-center">
                                Try re-fetching. If that does not help -
                                database is empty.
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="text-center text-foreground-2! text-5! whitespace-nowrap">
                                Project selection
                            </span>
                            <span className="text-center">
                                Select a project first to emulate events
                            </span>
                        </>
                    )}
                </div>

                {!!Object.values(projects).length && (
                    <>
                        <hr />
                        <ProjectList />
                    </>
                )}

                <hr />
                <Controller />
            </div>
        </>
    );
};

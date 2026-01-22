"use client";
import { useParams } from "next/navigation";
import { useAppStore } from "@/zustand/store";
import { Controller } from "./Controller";
import { FetchPrompt } from "./FetchPrompt";
import { ProjectList } from "./ProjectList";
import { Topline } from "./Topline";
import { LoadingEmulate } from "@/features/loading/components/LoadingEmulate";
import { AbsentTopline } from "@/features/loading/components/AbsentTopline";
import { Button } from "@/features/ui/button/components/Button";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import Image from "next/image";

export const Emulate = () => {
    // url
    const { id } = useParams<{ id: string | undefined }>();

    // zustand states
    const projects = useAppStore((state) => state.projects);
    const status = useAppStore((state) => state.status);
    const promises = useAppStore((state) => state.promises);
    const sync = useAppStore((state) => state.sync);

    // error handling:
    // authentcation's missing
    if (!status || status?.role === "user") {
        return (
            <>
                <AbsentTopline title="Not authenticated / lacking permissions" />

                <div className="flex flex-col w-full max-w-400 p-6! rounded-4xl! gap-4! m-auto box">
                    <LoadingEmulate />
                </div>
            </>
        );
    }

    // no data fetched
    if (!projects) {
        return (
            <>
                <AbsentTopline title="Data is absent" />

                <div className="flex flex-col w-full mt-16 max-w-400 p-6! rounded-4xl! gap-4! m-auto box">
                    <div className="flex flex-col gap-2 w-full max-w-4xl mx-auto">
                        <FetchPrompt />
                    </div>
                </div>
            </>
        );
    }

    // data is fetched and project at the id is not fetched
    if (id && !projects[id]) {
        return (
            <>
                <AbsentTopline title="Project does not exist" />

                <div className="flex flex-col w-full max-w-400 m-auto box p-6! rounded-4xl!">
                    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
                        <FetchPrompt />
                        <hr />
                        <ProjectList />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Topline />

            <div className="flex flex-col w-full max-w-7xl p-6! rounded-4xl! gap-8! box m-auto">
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

                            <Button
                                className="w-full max-w-64 self-center"
                                onClick={() => {
                                    sync();
                                }}
                            >
                                <PromiseStatus status={promises.sync} />
                                <Image
                                    width={16}
                                    height={16}
                                    alt=""
                                    src="/server.svg"
                                />
                                Fetch
                            </Button>
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

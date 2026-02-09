"use client";
import { useParams } from "next/navigation";
import { Controller } from "./Controller";
import { FetchPrompt } from "./FetchPrompt";
import { ProjectList } from "./ProjectList";
import { Topline } from "./Topline";
import { LoadingEmulate } from "@/features/ui/loading/components/LoadingEmulate";
import { AbsentTopline } from "@/features/ui/loading/components/AbsentTopline";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { wrapPromise } from "@/promises/core";
import { PromiseState } from "@/promises/components/PromiseState";
import { useQuery } from "@/query/core";
import { dashboardSync } from "@/query-api/calls/dashboard";

export const Emulate = () => {
    // url
    const { id } = useParams<{ id: string | undefined }>();

    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data, isLoading } = useQuery({ key: ["projects"] });

    // fallbacks
    if (!status) {
        return (
            <>
                <AbsentTopline title="Not authenticated / lacking permissions" />

                <div className="flex flex-col w-full max-w-400 p-6! rounded-4xl! gap-4! m-auto box">
                    <LoadingEmulate />
                </div>
            </>
        );
    }

    // loading
    if (isLoading) {
        return (
            <>
                <AbsentTopline title="Loading..." />

                <div className="flex flex-col w-full mt-16 max-w-400 min-h-128 p-6! rounded-4xl! gap-4! m-auto box">
                    <LoadingEmulate />
                </div>
            </>
        );
    }

    // no data fetched
    if (!data) {
        return (
            <>
                <AbsentTopline title="Data is absent" />

                <div className="flex flex-col w-full mt-16 max-w-400 min-h-128 p-6! rounded-4xl! gap-4! m-auto box">
                    <FetchPrompt />
                </div>
            </>
        );
    }

    // data is fetched and project at the id is not fetched
    if (data && id && !data[id]) {
        return (
            <>
                <AbsentTopline title="Project does not exist" />

                <div className="flex flex-col gap-8! w-full max-w-400 min-h-128 m-auto box p-6! rounded-4xl!">
                    <FetchPrompt />
                    <hr />
                    <ProjectList data={data} />
                </div>
            </>
        );
    }

    return (
        <>
            <Topline />

            <div className="flex flex-col w-full max-w-400 p-6! min-h-128 rounded-4xl! gap-8! box m-auto">
                <div className="flex flex-col gap-2 items-center">
                    {!Object.values(data).length ? (
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
                                    wrapPromise("dashboardSync", () => {
                                        return dashboardSync({});
                                    });
                                }}
                            >
                                <PromiseState state="dashboardSync" />
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
                            <span className="flex items-center gap-1 text-center whitespace-nowrap">
                                <Image
                                    width={16}
                                    height={16}
                                    alt=""
                                    src="/link.svg"
                                />
                                <span className="text-5!">
                                    Project selection
                                </span>
                            </span>
                            <span className="text-center">
                                Select a project first to emulate events
                            </span>
                        </>
                    )}
                </div>

                {!!Object.values(data).length && <ProjectList data={data} />}

                <Controller data={data} />
            </div>
        </>
    );
};

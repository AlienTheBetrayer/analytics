"use client";
import { useParams } from "next/navigation";
import { AuthRequired } from "@/features/authentication/components/AuthRequired";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import { Controller } from "./Controller";
import { FetchPrompt } from "./FetchPrompt";
import { ProjectList } from "./ProjectList";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { promiseStatus } from "@/utils/status";
import { Tooltip } from "@/features/tooltip/components/Tooltip";

export const Emulate = () => {
    // url
    const { id } = useParams<{ id: string | undefined }>();

    // zustand states
    const data = useAppStore((state) => state.data);
    const status = useAppStore((state) => state.status);
    const promises = useAppStore((state) => state.promises);

    // zustand functions
    const updateProjectList = useAppStore((state) => state.updateProjectList);

    // error handling:
    // authentcation's missing
    if (status === undefined || status.isLoggedIn === false || status.user.role === "user") {
        return <AuthRequired />;
    }

    // no data fetched
    if (data === undefined) {
        return (
            <div className="flex flex-col w-full mt-16 max-w-xl p-6! rounded-4xl! gap-4! m-auto box">
                <FetchPrompt />
            </div>
        );
    }
    
    // data is fetched and project at the id is not fetched
    if (id !== undefined && data[id] === undefined) {
        return (
            <div className="flex flex-col w-full max-w-2xl m-auto box">
                <FetchPrompt />
                <hr />
                <ProjectList data={data} />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full max-w-3xl p-6! rounded-4xl! gap-4! box m-auto">
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap">
                    <Button
                        onClick={() => {
                            updateProjectList();
                        }}
                    >
                        {promiseStatus(promises.projects)}
                        <Image width={16} height={16} alt="" src="/download.svg" />
                        Re-fetch
                    </Button>

                    {id === undefined ? (
                        <Tooltip className="ml-auto" direction="top" text="To the dashboard">
                            <LinkButton href="/dashboard">
                                <Image src="/back.svg" alt="" width={16} height={16} />
                                Go back
                            </LinkButton>
                        </Tooltip>
                    ) : (
                        <Tooltip className="ml-auto" direction="top" text="Remove selection">
                            <LinkButton href="/dashboard/emulate">
                                <Image src="/cross.svg" alt="" width={16} height={16} />
                                De-select
                            </LinkButton>
                        </Tooltip>
                    )}
                </div>
                {!data || Object.values(data).length === 0 ? (
                    <>
                        <span className="text-center text-foreground-2! text-5! whitespace-nowrap">
                            <u>No project data</u>
                        </span>
                        <span className="text-center">
                            Try re-fetching. If that does not help - database is empty.
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-center text-foreground-2! text-5! whitespace-nowrap">
                            Project selection
                        </span>
                        <span className="text-center">
                            Select a project first to emulate events / aggregates
                        </span>
                    </>
                )}
            </div>

            <hr />
            <ProjectList data={data} />

            <hr />
            <Controller />
        </div>
    );
};

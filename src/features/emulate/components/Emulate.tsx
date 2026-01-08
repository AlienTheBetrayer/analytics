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
import { promiseStatus } from "@/utils/other/status";
import { Tooltip } from "@/features/tooltip/components/Tooltip";

export const Emulate = () => {
    // url
    const { id } = useParams<{ id: string | undefined }>();

    // zustand states
    const projects = useAppStore((state) => state.projects);
    const status = useAppStore((state) => state.status);
    const promises = useAppStore((state) => state.promises);

    // zustand functinos
    const sync = useAppStore((state) => state.sync);

    // error handling:
    // authentcation's missing
    if (status === undefined || status.role === "user") {
        return <AuthRequired />;
    }

    // no data fetched
    if (!projects) {
        return (
            <div className="flex flex-col w-full mt-16 max-w-xl p-6! rounded-4xl! gap-4! m-auto box">
                <FetchPrompt />
            </div>
        );
    }

    // data is fetched and project at the id is not fetched
    if (id && !projects[id]) {
        return (
            <div className="flex flex-col w-full max-w-2xl m-auto box p-6! rounded-4xl!">
                <FetchPrompt />
                <hr />
                <ProjectList />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full max-w-3xl p-6! rounded-4xl! gap-4! box m-auto">
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap">
                    <Tooltip
                        direction="top"
                        text="Reload project data"
                    >
                        <Button
                            onClick={() => {
                                sync({ caching: false });
                            }}
                        >
                            {promiseStatus(promises.sync)}
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/download.svg"
                            />
                            <mark>Sync</mark>
                        </Button>
                    </Tooltip>

                    {!id ? (
                        <Tooltip
                            className="ml-auto"
                            direction="top"
                            text="To the dashboard"
                        >
                            <LinkButton href="/dashboard">
                                <Image
                                    src="/back.svg"
                                    alt=""
                                    width={16}
                                    height={16}
                                />
                                Go back
                            </LinkButton>
                        </Tooltip>
                    ) : (
                        <Tooltip
                            className="ml-auto"
                            direction="top"
                            text="Remove selection"
                        >
                            <LinkButton href="/emulate">
                                <Image
                                    src="/cross.svg"
                                    alt=""
                                    width={16}
                                    height={16}
                                />
                                De-select
                            </LinkButton>
                        </Tooltip>
                    )}
                </div>
                {!Object.values(projects).length ? (
                    <>
                        <span className="text-center text-foreground-2! text-5! whitespace-nowrap">
                            <u>No project data</u>
                        </span>
                        <span className="text-center">
                            Try re-fetching. If that does not help - database is
                            empty.
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-center text-foreground-2! text-5! whitespace-nowrap">
                            Project selection
                        </span>
                        <span className="text-center">
                            Select a project first to emulate events /
                            aggregates
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
    );
};

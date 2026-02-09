import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { SessionList } from "../parts/SessionList";
import { useMemo } from "react";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { PromiseState } from "@/promises/components/PromiseState";
import { useQuery } from "@/query/core";
import { queryInvalidate } from "@/query/auxiliary";
import { wrapPromise } from "@/promises/core";
import { terminateSessions } from "@/query-api/calls/auth";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Sessions = ({ data }: Props) => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data: sessions, isLoading: sessionsLoading } = useQuery({
        key: ["sessions", data.id],
    });

    // ui states
    const currentSessions = useMemo(() => {
        if (!sessions || !status) {
            return;
        }

        const objSessions = Object.values(sessions);

        if (!objSessions.length) {
            return;
        }

        return [...objSessions].sort((a) => (a.is_current ? -1 : 1));
    }, [sessions, status]);

    // message boxes
    const deleteBox = useMessageBox();

    return (
        <div className="flex flex-col gap-4 grow">
            {deleteBox.render({
                children: "All your other sessions will be terminated.",
                onSelect: (res) => {
                    if (res === "yes") {
                        // no sessions (ensuring safety + types)
                        if (!currentSessions?.length) {
                            return;
                        }

                        const notCurrent = currentSessions
                            ?.filter((s) => !s.is_current)
                            .map((s) => s.id);

                        // if by some accident there's no current sessions
                        if (notCurrent.length === currentSessions.length) {
                            return;
                        }

                        wrapPromise("terminateSessions", () => {
                            return terminateSessions({
                                user_id: data.id,
                                session_ids: notCurrent,
                            });
                        });
                    }
                },
            })}

            <span className="flex items-center gap-2">
                <Tooltip
                    text="Re-load visible sessions"
                    direction="top"
                >
                    <Button
                        onClick={() => {
                            wrapPromise("sessionsReload", async () => {
                                return queryInvalidate({
                                    key: ["sessions", data.id],
                                    silent: false,
                                });
                            });
                        }}
                    >
                        <PromiseState state="sessionsReload" />
                        <Image
                            src="/reload.svg"
                            width={14}
                            height={14}
                            alt="refresh"
                        />
                    </Button>
                </Tooltip>

                <span>Sessions</span>

                <small className="ml-auto text-ellipsis-left">
                    (all your logged in accounts)
                </small>
            </span>

            {sessionsLoading ? (
                <ul className="flex flex-col gap-2">
                    {Array.from({ length: 4 }, (_, k) => (
                        <li
                            key={k}
                            className="w-full loading h-10"
                        ></li>
                    ))}
                </ul>
            ) : (
                <SessionList
                    data={data}
                    currentSessions={currentSessions}
                />
            )}

            <Tooltip
                text="Keep only this session logged in"
                direction="bottom"
                className="w-full mt-auto!"
            >
                <Button
                    className="w-full"
                    onClick={() => {
                        deleteBox.show();
                    }}
                    isEnabled={(currentSessions?.length ?? 0) > 1}
                >
                    <PromiseState state="terminateSessions" />
                    <Image
                        src="/auth.svg"
                        width={16}
                        height={16}
                        alt=""
                    />
                    Terminate other sessions
                </Button>
            </Tooltip>
        </div>
    );
};

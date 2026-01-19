import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { SessionList } from "../parts/SessionList";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { useMemo, useState } from "react";
import { MessageBox } from "@/features/ui/messagebox/components/MessageBox";

type Props = {
    data: { user: User; profile: Profile };
};

export const Sessions = ({ data }: Props) => {
    // zustand
    const status = useAppStore((state) => state.status);
    const sessions = useAppStore((state) => state.sessions);
    const promises = useAppStore((state) => state.promises);
    const getSessions = useAppStore((state) => state.getSessions);
    const terminateSessions = useAppStore((state) => state.terminateSessions);

    // ui states
    const currentSessions = useMemo(() => {
        if (!sessions[data.user.id]?.length || !status) {
            return undefined;
        }

        return [...sessions[data.user.id].sort((a) => (a.isCurrent ? -1 : 1))];
    }, [sessions, data, status]);

    // message boxes
    const [boxVisibility, setBoxVisibility] = useState<{
        delete: boolean;
    }>({ delete: false });

    return (
        <div className="flex flex-col gap-4 grow">
            <MessageBox
                visibility={boxVisibility.delete}
                onSelect={(res) => {
                    setBoxVisibility((prev) => ({
                        ...prev,
                        delete: false,
                    }));
                    
                    if (res === "yes") {
                        // no sessions (ensuring safety + types)
                        if (!currentSessions?.length) {
                            return;
                        }

                        const notCurrent = currentSessions
                            ?.filter((s) => !s.isCurrent)
                            .map((s) => s.id);

                        // if by some accident there's no current sessions
                        if (notCurrent.length === currentSessions.length) {
                            return;
                        }

                        terminateSessions({
                            user_id: data.user.id,
                            ids: notCurrent,
                        });
                    }
                }}
            >
                All your other sessions will be terminated.
            </MessageBox>

            <span className="flex items-center gap-2">
                <Tooltip
                    text="Re-load visible sessions"
                    direction="top"
                >
                    <Button
                        className="p-0!"
                        onClick={() => {
                            getSessions({
                                type: "all",
                                user_id: data.user.id,
                                caching: false,
                                promiseKey: "sessionsReload",
                            });
                        }}
                    >
                        {promises.sessionsReload === "pending" ? (
                            <Spinner />
                        ) : (
                            <Image
                                src="/reload.svg"
                                width={14}
                                height={14}
                                alt="refresh"
                            />
                        )}
                    </Button>
                </Tooltip>

                <span>Sessions</span>

                <small className="ml-auto text-ellipsis-left">
                    (all your logged in accounts)
                </small>
            </span>

            <SessionList
                data={data}
                currentSessions={currentSessions}
            />

            <hr className="mt-auto -mb-2" />

            <Tooltip
                text="Keep only this session logged in"
                direction="bottom"
                className="w-full"
            >
                <Button
                    className="w-full"
                    onClick={() => {
                        setBoxVisibility((prev) => ({ ...prev, delete: true }));
                    }}
                >
                    <PromiseStatus status={promises.terminateSessions} />
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

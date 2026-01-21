import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { Token } from "@/types/tables/auth";
import { relativeTime } from "@/utils/other/relativeTime";

type Props = {
    data: { user: User; profile: Profile };
    currentSessions: Token[] | undefined;
};

export const SessionList = ({ data, currentSessions }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const terminateSessions = useAppStore((state) => state.terminateSessions);

    return (
        <ul
            className="flex flex-col overflow-y-auto h-full max-h-128 scheme-dark gap-px"
            style={{
                scrollbarWidth: "thin",
            }}
        >
            {currentSessions ? (
                currentSessions.map((token) => (
                    <li
                        key={token.id}
                        className={`flex gap-2 items-center rounded-full min-h-14 px-4! ${token.isCurrent ? "border-2 border-blue-2" : ""}`}
                    >
                        {token.isCurrent ? (
                            <div className="flex items-center gap-2">
                                <div className="rounded-full outline-2 outline-blue-2 p-2">
                                    <Image
                                        alt=""
                                        width={20}
                                        height={20}
                                        src="/privacy.svg"
                                    />
                                </div>
                                <span>Ongoing</span>
                            </div>
                        ) : (
                            <span className="truncate">{token.id}</span>
                        )}

                        <span className="truncate ml-auto">
                            {relativeTime(token.last_seen_at)}
                        </span>

                        <Tooltip
                            direction="top"
                            text="Log out & delete this session"
                            isEnabled={!token.isCurrent}
                        >
                            <Button
                                isEnabled={!token.isCurrent}
                                onClick={async () => {
                                    terminateSessions({
                                        ids: [token.id],
                                        user_id: data.user.id,
                                        promiseKey: `terminateSessions_${token.id}`,
                                    });
                                }}
                            >
                                <PromiseStatus
                                    status={
                                        promises[
                                            `terminateSessions_${token.id}`
                                        ]
                                    }
                                />
                                <Image
                                    src="/delete.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                />
                                Terminate
                            </Button>
                        </Tooltip>
                    </li>
                ))
            ) : (
                <li className="flex flex-col gap-1 m-auto! items-center">
                    {promises.getSessions === "pending" ||
                    promises.sessionsReload === "pending" ? (
                        <Spinner
                            width={24}
                            height={24}
                        />
                    ) : (
                        <span>No sessions</span>
                    )}
                </li>
            )}
        </ul>
    );
};

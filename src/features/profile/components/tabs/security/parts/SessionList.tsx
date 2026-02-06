import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { Token } from "@/types/tables/auth";
import { relativeTime } from "@/utils/other/relativeTime";
import { PromiseState } from "@/promises/components/PromiseState";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { terminateSessions } from "@/query-api/calls/auth";
import { wrapPromise } from "@/promises/core";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
    currentSessions: Token[] | undefined;
};

export const SessionList = ({ data, currentSessions }: Props) => {
    if (!currentSessions?.length) {
        return null;
    }

    return (
        <ul
            className="flex flex-col overflow-y-auto h-full max-h-128 scheme-dark gap-2"
            style={{
                scrollbarWidth: "thin",
            }}
        >
            {currentSessions.map((token) => (
                <li
                    key={token.id}
                    className={`flex gap-2 hover:bg-background-4 focus-within:bg-background-4
                            items-center rounded-full min-h-14 px-4! 
                             transition-all duration-400 ease-out 
                             border-2 border-background-4
                            ${token.is_current ? "border-2 border-blue-2" : ""}`}
                >
                    {token.is_current ? (
                        <div className="flex items-center gap-1">
                            <Image
                                alt=""
                                width={20}
                                height={20}
                                src="/privacy.svg"
                            />
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
                        isEnabled={!token.is_current}
                    >
                        <Button
                            isEnabled={!token.is_current}
                            onClick={async () => {
                                wrapPromise(
                                    `terminateSessions_${token.id}`,
                                    () => {
                                        return terminateSessions({
                                            session_ids: [token.id],
                                            user_id: data.id,
                                        });
                                    },
                                );
                            }}
                        >
                            <PromiseState
                                state={`terminateSessions_${token.id}`}
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
            ))}
        </ul>
    );
};

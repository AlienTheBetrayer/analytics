import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { ResponseSession } from "@/types/api/responses/auth";
import { Profile, User } from "@/types/tables/account";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    data: { user: User; profile: Profile };
    currentSessions: ResponseSession[] | undefined;
};

export const SessionList = ({ data, currentSessions }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const terminateSessions = useAppStore((state) => state.terminateSessions);

    return (
        <ul
            className="flex flex-col overflow-y-auto h-full max-h-42 scheme-dark gap-px"
            style={{
                scrollbarWidth: "thin",
            }}
        >
            {currentSessions ? (
                currentSessions.map((token) => (
                    <li
                        key={token.id}
                        className={`flex gap-2 items-center rounded-full min-h-12 px-4! ${token.isCurrent ? "border border-blue-2" : ""}`}
                    >
                        {token.isCurrent ? (
                            <>
                                <Image
                                    alt=""
                                    width={20}
                                    height={20}
                                    src="/privacy.svg"
                                />
                                <span>Ongoing</span>
                            </>
                        ) : (
                            <span className="truncate">{token.id}</span>
                        )}

                        <Tooltip
                            className="ml-auto"
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
                                {promiseStatus(
                                    promises[`terminateSessions_${token.id}`],
                                )}
                                <Image
                                    src="/cross.svg"
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

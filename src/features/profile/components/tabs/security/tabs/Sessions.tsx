import { usePopup } from "@/features/ui/popup/hooks/usePopup";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { ResponseSession } from "@/types/api/responses/auth";
import { Profile, User } from "@/types/tables/account";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { SessionList } from "../parts/SessionList";

type Props = {
    data: { user: User; profile: Profile };
    currentSessions: ResponseSession[] | undefined;
    terminateMessageBox: ReturnType<typeof usePopup>;
};

export const Sessions = ({
    data,
    currentSessions,
    terminateMessageBox,
}: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const getSessions = useAppStore((state) => state.getSessions);

    return (
        <div className="flex flex-col gap-4 grow">
            {terminateMessageBox.render()}

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
                        terminateMessageBox.show();
                    }}
                >
                    {promiseStatus(promises.terminateSessions)}
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

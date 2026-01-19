import { Tooltip } from "@/features/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Data } from "./tabs/Data";
import { Profile, User } from "@/types/tables/account";
import { Sessions } from "./tabs/Sessions";
import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { useAppStore } from "@/zustand/store";

export type SecurityTab = "Data" | "Sessions";

type Props = {
    data: { user: User; profile: Profile };
};

export const Select = ({ data }: Props) => {
    // zustand
    const status = useAppStore((state) => state.status);
    const sessions = useAppStore((state) => state.sessions);
    const terminateSessions = useAppStore((state) => state.terminateSessions);

    // react states
    const [selected, setSelected] = useState<SecurityTab>("Data");

    const currentSessions = useMemo(() => {
        if (!sessions[data.user.id]?.length || !status) {
            return undefined;
        }

        return [...sessions[data.user.id].sort((a) => (a.isCurrent ? -1 : 1))];
    }, [sessions, data, status]);

    const terminateMessageBox = usePopup(({ hide }) => (
        <MessageBox
            description="All your other sessions will be terminated."
            onInteract={(res) => {
                hide();
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
        />
    ));

    const element = () => {
        switch (selected) {
            case "Data": {
                return (
                    <Data
                        data={data}
                        terminateMessageBox={terminateMessageBox}
                    />
                );
            }
            case "Sessions": {
                return (
                    <Sessions
                        data={data}
                        currentSessions={currentSessions}
                        terminateMessageBox={terminateMessageBox}
                    />
                );
            }
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div
                className={`box p-0! gap-1! my-2 flex-row! w-full m-auto transition-all duration-500 h-10 items-center`}
            >
                <Tooltip
                    text="Valuable authentication data"
                    direction="top"
                >
                    <Button
                        className={`p-0! md:px-2!`}
                        onClick={() => {
                            setSelected("Data");
                        }}
                    >
                        <Image
                            width={16}
                            height={16}
                            alt="data"
                            src="/cube.svg"
                        />
                        <span className="hidden md:block">Data</span>
                        <TabSelection
                            condition={selected === "Data"}
                            color="var(--blue-1)"
                        />
                    </Button>
                </Tooltip>

                <Tooltip
                    text="Logged in sessions"
                    direction="top"
                >
                    <Button
                        className={`p-0! md:px-2!`}
                        onClick={() => {
                            setSelected("Sessions");
                        }}
                    >
                        <Image
                            width={16}
                            height={16}
                            alt="sessions"
                            src="/auth.svg"
                        />
                        <span className="hidden md:block">Sessions</span>
                        <TabSelection
                            condition={selected === "Sessions"}
                            color="var(--blue-1)"
                        />
                    </Button>
                </Tooltip>
            </div>

            <hr />

            {element()}
        </div>
    );
};

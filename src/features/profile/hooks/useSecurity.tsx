import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Profile, User } from "@/types/tables/account";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";
import { redirect } from "next/navigation";
import { useMemo } from "react";

export const useSecurity = (data: { user: User; profile: Profile }) => {
    // zustand
    const status = useAppStore((state) => state.status);
    const sessions = useAppStore((state) => state.sessions);
    const setVisibleProfile = useLocalStore((state) => state.setVisibleProfile);
    const logout = useAppStore((state) => state.logout);
    const deleteUser = useAppStore((state) => state.deleteUser);
    const terminateSessions = useAppStore((state) => state.terminateSessions);

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

    // message boxes
    const deleteMessageBox = usePopup(({ hide }) => (
        <MessageBox
            description="You are about to delete your account data forever!"
            onInteract={(res) => {
                hide();
                if (res === "yes") {
                    deleteUser(data.user.id);
                    if (data.user.id === status?.id) {
                        logout();
                        setVisibleProfile(undefined);
                        redirect("/home");
                    }
                }
            }}
        />
    ));

    return { deleteMessageBox, terminateMessageBox, currentSessions };
};

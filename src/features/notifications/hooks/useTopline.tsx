import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { NotificationTab } from "@/types/zustand/local";
import { useLocalStore } from "@/zustand/localStore";

export const useTopline = (tab: NotificationTab) => {
    // zustand
    const notifications = useLocalStore((state) => state.notifications);
    const clearNotifications = useLocalStore(
        (state) => state.clearNotifications
    );

    // messageboxes
    const messageBox = usePopup(({ hide }) => (
        <MessageBox
            description="Deleting will clear all the notifications that you had on this specific tab"
            onInteract={(res) => {
                hide();

                if (res === "no") {
                    return;
                }

                clearNotifications({
                    id: Object.values(
                        tab === "Account"
                            ? notifications.account
                            : notifications.dashboard
                    ).map((n) => n.id),
                });
            }}
        />
    ));

    return { messageBox };
};

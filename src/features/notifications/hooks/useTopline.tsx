import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import {
    AccountFilter,
    DashboardFilter,
    DashboardNotificationTab,
} from "@/types/zustand/local";
import { useLocalStore } from "@/zustand/localStore";

export const useTopline = (
    filter: AccountFilter | DashboardFilter,
    type: DashboardNotificationTab
) => {
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
                if (res === "yes") {
                    clearNotifications({
                        id:
                            type === "Account"
                                ? Object.values(notifications.account).map(
                                      (n) => n.id
                                  )
                                : Object.values(notifications.dashboard).map(
                                      (n) => n.id
                                  ),
                    });
                }
            }}
        />
    ));

    return { messageBox };
};

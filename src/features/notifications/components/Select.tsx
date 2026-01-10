import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { AbsentNotification } from "./errors/AbsentNotification";
import { Notification } from "./specific/Notification";
import { NotificationRoute } from "../types/notifications";
import { Dashboard } from "./tabs/dashboard/Dashboard";
import { Account } from "./tabs/account/Account";
import { All } from "./tabs/All";
import { Emulate } from "./tabs/Emulate";
import { Preferences } from "./tabs/Preferences";

type Props = {
    type: NotificationRoute;
};

export const Select = ({ type }: Props) => {
    // zustand
    const notifications = useAppStore((state) => state.notifications);
    const clearUnread = useAppStore((state) => state.clearUnread);

    // url
    const { id, tab } = useParams<{ id?: string; tab?: string }>();

    // clearing the unread status
    useEffect(() => {
        if (tab !== "dashboard" && tab !== "account" && tab !== "all" && !tab) {
            return;
        }

        const tabs = !tab || tab === "all" ? ["dashboard", "account"] : [tab];

        for (const tab of tabs) {
            clearUnread({ tab: tab as "dashboard" | "account" });
        }
    }, [tab, clearUnread]);

    switch (type) {
        case "general": {
            switch (tab) {
                default:
                case "all": {
                    return <All />;
                }
                case "dashboard": {
                    return <Dashboard />;
                }
                case "account": {
                    return <Account />;
                }
                case "emulate": {
                    return <Emulate />;
                }
                case "preferences": {
                    return <Preferences />;
                }
            }
        }
        case "specific": {
            const idData =
                id &&
                (notifications.account[id] || notifications.dashboard[id]);

            if (!idData) {
                return <AbsentNotification />;
            }

            if (id) {
                return <Notification data={idData} />;
            }
            break;
        }
    }
};

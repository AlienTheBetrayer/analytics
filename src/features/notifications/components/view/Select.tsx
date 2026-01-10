import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { Emulate } from "../Emulate";
import { useEffect } from "react";
import { AbsentNotification } from "../errors/AbsentNotification";
import { Notification } from "../specific/Notification";
import { NotificationRoute } from "../../types/notifications";
import { All } from "../All";
import { Dashboard } from "../Dashboard";
import { Account } from "../Account";

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

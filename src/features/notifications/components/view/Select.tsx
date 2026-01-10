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
        if (tab === "emulate") {
            return;
        }
        //// FIX THIS /////////////////////////////
        clearUnread({ tab: (tab ?? "all") as "dashboard" | "account" });
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

import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { Display } from "../Display";
import { Emulate } from "../Emulate";
import { useEffect } from "react";
import { AbsentNotification } from "../errors/AbsentNotification";
import { Notification } from "../specific/Notification";
import { NotificationRoute } from "../../types/notifications";

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
        if (tab !== "dashboard" && tab !== "account" && !tab) {
            return;
        }

        clearUnread({ tab: (tab ?? "dashboard") as "dashboard" | "account" });
    }, [tab, clearUnread]);

    switch (type) {
        case "general": {
            switch (tab) {
                default:
                case "dashboard": {
                    return <Display data={notifications.dashboard} />;
                }
                case "account": {
                    return <Display data={notifications.account} />;
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

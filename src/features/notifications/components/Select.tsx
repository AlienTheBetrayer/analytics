import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Notification } from "./tabs/notification/Notification";
import { NotificationRoute } from "../types/notifications";
import { Dashboard } from "./tabs/dashboard/Dashboard";
import { Account } from "./tabs/account/Account";
import { All } from "./tabs/All";
import { Emulate } from "./tabs/Emulate";
import { Preferences } from "./tabs/Preferences";
import { useLocalStore } from "@/zustand/localStore";

type Props = {
    type: NotificationRoute;
};

export const Select = ({ type }: Props) => {
    // zustand
    const clearUnread = useLocalStore((state) => state.clearUnread);

    // url
    const { tab } = useParams<{ id?: string; tab?: string }>();

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
            return <Notification />;
        }
    }
};

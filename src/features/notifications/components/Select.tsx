import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Notification } from "./tabs/notification/Notification";
import { NotificationRoute } from "../types/notifications";
import { Dashboard } from "./tabs/dashboard/Dashboard";
import { Account } from "./tabs/account/Account";
import { All } from "./tabs/All";
import { Emulate } from "./tabs/Emulate";
import { Preferences } from "./tabs/Preferences";
import { useAppStore } from "@/zustand/store";

type Props = {
    type: NotificationRoute;
};

export const Select = ({ type }: Props) => {
    // zustand
    const clearData = useAppStore((state) => state.clearData);

    // url
    const { tab } = useParams<{ id?: string; tab?: string }>();

    // clearing the unread status
    useEffect(() => {
        if (tab !== "dashboard" && tab !== "account" && tab !== "all" && !tab) {
            return;
        }

        const tabs = !tab || tab === "all" ? ["Dashboard", "Account"] : [tab];

        for (const tab of tabs) {
            clearData({ tab: tab as "Dashboard" | "Account", type: "unread" });
        }
    }, [tab, clearData]);

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

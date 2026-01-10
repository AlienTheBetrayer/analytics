import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { Display } from "../Display";
import { Emulate } from "../Emulate";
import { useEffect } from "react";

export const Select = () => {
    // zustand
    const notifications = useAppStore((state) => state.notifications);
    const clearUnread = useAppStore((state) => state.clearUnread);

    // url
    const { tab } = useParams<{ tab?: string }>();

    useEffect(() => {
        if (tab !== "dashboard" && tab !== "account" && !tab) {
            return;
        }

        clearUnread({ tab: (tab ?? "dashboard") as "dashboard" | "account" });
    }, [tab, clearUnread]);

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
};

import { useMemo } from "react";
import { FilterTabType } from "../components/toplines/Filter";
import { NotificationTab, NotificationType } from "@/types/other/notifications";
import { useAppStore } from "@/zustand/store";

export const useFilterSelector = (
    tab: FilterTabType,
    notificationTab: NotificationTab
) => {
    const notifications = useAppStore((state) => state.notifications)[
        notificationTab
    ];

    // ui states
    const uniqueTypes = useMemo(() => {
        return Array.from(
            new Set(
                Object.values(notifications)
                    .map((n) => n.type)
                    .filter(Boolean) as NotificationType[]
            )
        );
    }, [notifications]);

    const uniqueTitles = useMemo(() => {
        return Array.from(
            new Set(
                Object.values(notifications)
                    .map((n) => n.title)
                    .filter(Boolean)
            )
        );
    }, [notifications]);

    const notificationCount = useMemo(() => {
        const count: Record<string, number> = {};
        for (const notification of Object.values(notifications)) {
            count[notification.status] = (count[notification.status] ?? 0) + 1;
            if (notification.type) {
                count[notification.type] = (count[notification.type] ?? 0) + 1;
            }
            count[notification.title] = (count[notification.title] ?? 0) + 1;
        }

        return count;
    }, [notifications]);

    const items = useMemo(() => {
        switch (tab) {
            case "Status": {
                return ["Error", "Warning", "Information"];
            }
            case "Title": {
                return uniqueTitles;
            }
            case "Type": {
                return uniqueTypes;
            }
            default: {
                return [];
            }
        }
    }, [tab, uniqueTitles, uniqueTypes]);

    return { notificationCount, items };
};

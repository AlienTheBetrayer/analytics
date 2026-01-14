import { Notification, NotificationTab } from "@/types/other/notifications";
import { useAppStore } from "@/zustand/store";
import { useMemo } from "react";

/**
 * returns all the dashboard notifications with filtering, searching and sorting
 */
export const useNotificationList = (tab: NotificationTab) => {
    // zustand state
    const notifications = useAppStore((state) => state.notifications)[tab];
    const filter = useAppStore((state) => state.filter)[tab];

    // filter events
    const search = filter.search;
    const filtering = filter.filtering;
    const sorting = filter.sorting;

    // filtering & memoization
    const filtered = useMemo(() => {
        let filtered: Notification[] = Object.values(notifications);

        if(!filtered.length) {
            return;
        }

        // search filtering
        if (search) {
            filtered = filtered.filter(
                (e) =>
                    e.title?.includes(search) || e.description?.includes(search)
            );
        }

        // column-filtering
        if (filtering) {
            filtered = filtered.filter(
                (e) =>
                    filtering[e.status] ||
                    filtering[e.title] ||
                    (e.type && filtering[e.type])
            );
        }
        // sorting
        const column = sorting?.column ?? "Sent Date";
        const direction = !sorting
            ? -1
            : (sorting.direction ?? "descendant") === "descendant"
              ? -1
              : 1;

        switch (column) {
            case "Title": {
                filtered.sort((a, b) =>
                    !a.title || !b.title
                        ? 0
                        : direction * a.title?.localeCompare(b.title)
                );
                break;
            }
            case "Description": {
                filtered.sort((a, b) =>
                    !a.description || !b.description
                        ? 0
                        : direction *
                          a.description?.localeCompare(b.description)
                );
                break;
            }
            case "Status": {
                filtered.sort((a, b) =>
                    !a.status || !b.status
                        ? 0
                        : direction * a.status?.localeCompare(b.status)
                );
                break;
            }
            case "Sent Date": {
                filtered.sort((a, b) =>
                    !a.sentAt || !b.sentAt
                        ? 0
                        : direction *
                          (new Date(a.sentAt).getTime() -
                              new Date(b.sentAt).getTime())
                );
                break;
            }
        }

        return filtered;
    }, [search, filtering, notifications, sorting]);

    return {
        filtered,
    };
};

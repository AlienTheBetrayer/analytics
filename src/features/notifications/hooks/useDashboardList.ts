import { DashboardNotification } from "@/types/zustand/local";
import { useLocalStore } from "@/zustand/localStore";
import { useMemo } from "react";

/**
 * returns all the dashboard notifications with filtering, searching and sorting
 */
export const useDashboardList = () => {
    // zustand state
    const notifications = useLocalStore((state) => state.notifications);
    const dashboardFilter = useLocalStore((state) => state.dashboardFilter);

    // all events
    const allNotifications = Object.values(notifications.dashboard);

    // filter events
    const search = dashboardFilter.search;
    const filtering = dashboardFilter.filtering;
    const sorting = dashboardFilter.sorting;

    // filtering & memoization
    const filtered = useMemo(() => {
        if (!allNotifications.length) {
            return;
        }

        let filtered: DashboardNotification[] = allNotifications;

        // search filtering
        if (search) {
            filtered = filtered.filter(
                (e) =>
                    e.title?.includes(search) || e.description?.includes(search)
            );
        }

        // column-filtering
        if (filtering) {
            filtered = filtered.filter((e) => filtering[e.status]);
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
    }, [search, allNotifications, filtering, sorting]);

    return {
        filtered,
    };
};

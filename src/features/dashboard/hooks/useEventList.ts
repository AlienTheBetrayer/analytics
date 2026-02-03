import { CacheAPIProtocol } from "@/query-api/protocol";
import { Event } from "@/types/tables/project";
import { useAppStore } from "@/zustand/store";
import { useMemo } from "react";

/**
 * returns all the events with filtering, searching and sorting
 */
export const useEventList = (
    selectedProjectId: string,
    data: CacheAPIProtocol["events"]["data"] | null,
) => {
    // zustand state
    const eventFilters = useAppStore((state) => state.eventFilters);

    // filter events
    const search = selectedProjectId
        ? eventFilters[selectedProjectId]?.eventsSearch
        : undefined;
    const filtering = selectedProjectId
        ? eventFilters[selectedProjectId]?.eventsFiltering
        : undefined;
    const sorting = selectedProjectId
        ? eventFilters[selectedProjectId]?.eventsSorting
        : undefined;

    // filtering & memoization
    const filteredEvents = useMemo(() => {
        if (!data) {
            return;
        }

        let filtered: Event[] = Object.values(data);

        // search filtering
        if (search) {
            filtered = filtered.filter(
                (e) =>
                    e.type?.includes(search) || e.description?.includes(search),
            );
        }

        // column-filtering
        if (filtering) {
            filtered = filtered.filter((e) => e.type && filtering[e.type]);
        }

        // sorting
        const column = sorting?.column ?? "Created Date";
        const direction = !sorting
            ? -1
            : (sorting.direction ?? "descendant") === "descendant"
              ? -1
              : 1;

        switch (column) {
            case "Type": {
                filtered.sort((a, b) =>
                    !a.type || !b.type
                        ? 0
                        : direction * a.type?.localeCompare(b.type),
                );
                break;
            }
            case "Description": {
                filtered.sort((a, b) =>
                    !a.description || !b.description
                        ? 0
                        : direction *
                          a.description?.localeCompare(b.description),
                );
                break;
            }
            case "Created Date": {
                filtered.sort((a, b) =>
                    !a.created_at || !b.created_at
                        ? 0
                        : direction *
                          (new Date(a.created_at).getTime() -
                              new Date(b.created_at).getTime()),
                );
                break;
            }
        }

        return filtered;
    }, [data, search, filtering, sorting]);

    return {
        filteredEvents,
    };
};

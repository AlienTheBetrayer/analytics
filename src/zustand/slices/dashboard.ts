import type {
    DashboardStore,
    EventColumns,
    ProjectColumns,
} from "@/types/zustand/dashboard";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";

export const DashboardSlice: SliceFunction<DashboardStore> = (set, get) => {
    return {
        notifications: [],
        eventFilters: {},
        projectFilters: {},

        setFilter: ({ project_id, ...options }) => {
            set((state) => {
                const eventFilters = { ...state.eventFilters };
                let projectFilters = { ...state.projectFilters };

                switch (options.type) {
                    case "event-search": {
                        if (!(typeof options.search === "string")) {
                            throw "options.search is not a string.";
                        }

                        eventFilters[project_id] = {
                            ...(eventFilters[project_id] ?? {}),
                            eventsSearch: options.search,
                        };
                        break;
                    }
                    case "event-sort": {
                        if (
                            options.column?.length &&
                            ["Type", "Description", "Created Date"].includes(
                                options.column[0]
                            )
                        ) {
                            eventFilters[project_id] = {
                                ...(eventFilters[project_id] ?? {}),
                                eventsSorting: {
                                    ...(eventFilters[project_id]
                                        ?.eventsSorting ?? {}),
                                    column: options.column[0] as EventColumns,
                                },
                            };
                        }

                        if (options.direction) {
                            eventFilters[project_id] = {
                                ...(eventFilters[project_id] ?? {}),
                                eventsSorting: {
                                    ...(eventFilters[project_id]
                                        ?.eventsSorting ?? {}),
                                    direction: options.direction,
                                },
                            };
                        }
                        break;
                    }
                    case "event-filter": {
                        if (
                            !(
                                typeof options.flag === "boolean" &&
                                options.column?.length
                            )
                        ) {
                            throw "options/flag/column are not defined.";
                        }

                        for (const column of options.column) {
                            eventFilters[project_id] = {
                                ...(eventFilters[project_id] ?? {}),
                                eventsFiltering: {
                                    ...(eventFilters[project_id]
                                        ?.eventsFiltering ?? {}),
                                    [column]: options.flag,
                                },
                            };
                        }

                        break;
                    }
                    case "project-search": {
                        if (!(typeof options.search === "string")) {
                            throw "options.search is not a string.";
                        }

                        projectFilters = {
                            ...(projectFilters ?? {}),
                            projectSearch: options.search,
                        };
                        break;
                    }
                    case "project-sort": {
                        if (
                            options.column?.length &&
                            ["Name", "Created Date", "Updated Date"].includes(
                                options.column[0]
                            )
                        ) {
                            projectFilters = {
                                ...(projectFilters ?? {}),
                                projectSorting: {
                                    ...(projectFilters?.projectSorting ?? {}),
                                    column: options.column[0] as ProjectColumns,
                                },
                            };
                        }

                        if (options.direction) {
                            projectFilters = {
                                ...(projectFilters ?? {}),
                                projectSorting: {
                                    ...(projectFilters?.projectSorting ?? {}),
                                    direction: options.direction,
                                },
                            };
                        }
                        break;
                    }
                }

                return { ...state, eventFilters, projectFilters };
            });
        },

        selectProject: (idx: string | undefined) => {
            const { selectedProjectId } = get();
            if (selectedProjectId === idx) {
                return;
            }

            set((state) => ({ ...state, selectedProjectId: idx }));
        },

        deselectProject: () => {
            const { selectedProjectId } = get();
            if (selectedProjectId === undefined) {
                return;
            }

            set((state) => ({ ...state, selectedProjectId: undefined }));
        },

        setNotifications: (notifications) => {
            set((state) => ({ ...state, notifications }));
        },

        pushNotification: (notification) => {
            set((state) => ({
                ...state,
                notifications: [...state.notifications, notification],
            }));
        },

        clearNotifications: () => {
            set((state) => ({ ...state, notifications: [] }));
        },
    };
};

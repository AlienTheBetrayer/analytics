import type { DashboardStore } from "@/types/zustand/dashboard";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";

export const DashboardSlice: SliceFunction<DashboardStore> = (set, get) => {
    return {
        notifications: [],
        filter: {},

        setFilter: ({ project_id, ...options }) => {
            set((state) => {
                const filter = { ...state.filter };

                switch (options.type) {
                    case "event-search": {
                        if (!(typeof options.search === "string")) {
                            throw "options.search is not a string.";
                        }

                        filter[project_id] = {
                            ...(filter[project_id] ?? {}),
                            eventsSearch: options.search,
                        };
                        break;
                    }
                    case "event-sort": {
                        if (options.column?.length) {
                            filter[project_id] = {
                                ...(filter[project_id] ?? {}),
                                eventsSorting: {
                                    ...(filter[project_id]?.eventsSorting ??
                                        {}),
                                    column: options.column[0],
                                },
                            };
                        }

                        if (options.direction) {
                            filter[project_id] = {
                                ...(filter[project_id] ?? {}),
                                eventsSorting: {
                                    ...(filter[project_id]?.eventsSorting ??
                                        {}),
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
                            filter[project_id] = {
                                ...(filter[project_id] ?? {}),
                                eventsFiltering: {
                                    ...(filter[project_id]?.eventsFiltering ??
                                        {}),
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

                        filter[project_id] = {
                            ...(filter[project_id] ?? {}),
                            projectSearch: options.search,
                        };
                        break;
                    }
                    case "project-sort": {
                        if (!options.column?.length) {
                            throw "options.column are not strings.";
                        }

                        filter[project_id] = {
                            ...(filter[project_id] ?? {}),
                            projectSorting: {
                                ...(filter[project_id]?.projectSorting ?? {}),
                                column: options.column[0],
                                direction: options.direction ?? "ascendant",
                            },
                        };
                        break;
                    }
                }

                return { ...state, filter };
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

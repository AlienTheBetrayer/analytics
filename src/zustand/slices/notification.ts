import { Notification } from "@/types/other/notifications";
import { NotificationStore } from "@/types/zustand/notification";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";

export const NotificationSlice: SliceFunction<NotificationStore> = (set) => {
    return {
        notifications: { Account: {}, Dashboard: {} },
        unreadTabs: { Account: false, Dashboard: false },
        expandedTabs: { Account: true, Dashboard: true },
        filter: {
            Account: {
                sorting: {
                    column: "Sent Date",
                    direction: "descendant",
                },
            },
            Dashboard: {
                sorting: {
                    column: "Sent Date",
                    direction: "descendant",
                },
            },
        },
        lastNotificationId: null,

        pushNotification: (options) => {
            set((state) => {
                // creating the notification
                const id = crypto.randomUUID();

                const notification: Notification = {
                    id,
                    status: options.status,
                    description: options.description,
                    title: options.title,
                    tab: options.tab,
                    type: options.type,
                    sentAt: new Date().toISOString(),
                };

                return {
                    ...state,
                    notifications: {
                        ...state.notifications,
                        [options.tab]: {
                            ...(state.notifications[options.tab] ?? {}),
                            [id]: notification,
                        },
                    },
                    unreadTabs: { ...state.unreadTabs, [options.tab]: true },
                    lastNotificationId: id,
                };
            });
        },

        clearData: (options) => {
            set((state) => {
                if (!options.tab) {
                    throw new Error("[tab] is undefined");
                }

                switch (options.type) {
                    case "filters": {
                        return {
                            ...state,
                            filter: {
                                ...state.filter,
                                [options.tab]: {
                                    sorting: {
                                        column: "Sent Date",
                                        direction: "descendant",
                                    },
                                    search: undefined,
                                    filtering: undefined,
                                },
                            },
                        };
                    }

                    case "unread": {
                        return {
                            ...state,
                            unreadTabs: {
                                ...state.unreadTabs,
                                [options.tab]: false,
                            },
                        };
                    }

                    case "notifications": {
                        if (!options.id) {
                            throw new Error("[id] is undefined");
                        }

                        const removeId = new Set(options.id ?? []);

                        const notifications = { ...state.notifications };
                        const filtered = Object.fromEntries(
                            Object.entries(notifications[options.tab]).filter(
                                ([id]) => !removeId.has(id),
                            ),
                        );

                        return {
                            ...state,
                            lastNotificationId:
                                state.lastNotificationId &&
                                removeId.has(state.lastNotificationId)
                                    ? null
                                    : state.lastNotificationId,
                            notifications: {
                                ...state.notifications,
                                [options.tab]: filtered,
                            },
                        };
                    }
                }
            });
        },

        setNotificationFilter: (options) => {
            set((state) => {
                switch (options.type) {
                    case "filter": {
                        if (
                            !(
                                typeof options.flag === "boolean" &&
                                options.column?.length
                            )
                        ) {
                            throw new Error(
                                "[flag, column] are undefined, both of them have to be present.",
                            );
                        }

                        const prev = state.filter[options.tab];

                        const filteredColumns = Object.fromEntries(
                            options.column.map((c) => [
                                c,
                                options.flag ?? false,
                            ]),
                        );

                        return {
                            ...state,
                            filter: {
                                ...state.filter,
                                [options.tab]: {
                                    ...prev,
                                    filtering: {
                                        ...prev.filtering,
                                        ...filteredColumns,
                                    },
                                },
                            },
                        };
                    }
                    case "filter-all": {
                        if (typeof options.flag !== "boolean") {
                            throw new Error("[flag] is not boolean");
                        }

                        const prev = state.filter[options.tab];

                        const filtering = Object.fromEntries(
                            Object.keys(prev.filtering ?? {}).map((k) => [
                                k,
                                options.flag ?? false,
                            ]),
                        );

                        return {
                            ...state,
                            filter: {
                                ...state.filter,
                                [options.tab]: {
                                    ...prev,
                                    filtering,
                                },
                            },
                        };
                    }
                    case "search": {
                        if (typeof options.search !== "string") {
                            throw new Error("[search] has to be a string");
                        }

                        const prev = state.filter[options.tab];

                        return {
                            ...state,
                            filter: {
                                ...state.filter,
                                [options.tab]: {
                                    ...prev,
                                    search: options.search,
                                },
                            },
                        };
                    }
                    case "sort": {
                        if (!(options.column || options.direction)) {
                            throw new Error(
                                "[column, direction] are undefined, at least one has to be present",
                            );
                        }

                        const prev = state.filter[options.tab];

                        return {
                            ...state,
                            filter: {
                                ...state.filter,
                                [options.tab]: {
                                    ...prev,
                                    sorting: {
                                        column:
                                            options.column?.[0] ??
                                            prev.sorting.column,
                                        direction:
                                            options.direction ??
                                            prev.sorting.direction,
                                    },
                                },
                            },
                        };
                    }
                }
            });
        },

        toggleCollapsed: (options) => {
            set((state) => ({
                ...state,
                expandedTabs: {
                    ...state.expandedTabs,
                    [options.tab]: !(state.expandedTabs[options.tab] ?? false),
                },
            }));
        },
    };
};

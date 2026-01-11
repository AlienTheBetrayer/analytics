import {
    DashboardNotification,
    LocalStore,
    ProfileMenuType,
    VisibleProfile,
} from "@/types/zustand/local";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";

export const LocalSlice: SliceFunction<LocalStore, LocalStore> = (set) => {
    return {
        profilesMenuType: "desktop",
        notifications: { dashboard: {}, account: {} },
        unreadTabs: {},
        preferences: {
            visibility: true,
        },
        accountFilter: {},
        dashboardFilter: {},
        collapsedTabs: {
            account: true,
            all: true,
            dashboard: true,
        },

        setProfilesMenuType: (type: ProfileMenuType) => {
            set((state) => ({ ...state, profilesMenuType: type }));
        },

        setVisibleProfile: (visibleProfile?: VisibleProfile) => {
            set((state) => ({ ...state, visibleProfile }));
        },

        pushNotification: (options) => {
            set((state) => {
                const notifications = { ...state.notifications };
                const unreadTabs = { ...state.unreadTabs };

                // creating the notification
                const id = crypto.randomUUID();

                const notification: DashboardNotification = {
                    id,
                    status: options.status,
                    description: options.description,
                    title: options.title,
                    type: options.type,
                    sentAt: new Date().toISOString(),
                };

                // storing it in memory
                switch (options.type) {
                    case "Account": {
                        notifications.account = {
                            ...notifications.account,
                            [id]: notification,
                        };
                        unreadTabs.account = true;
                        break;
                    }
                    case "Dashboard": {
                        notifications.dashboard = {
                            ...notifications.dashboard,
                            [id]: notification,
                        };
                        unreadTabs.dashboard = true;
                        break;
                    }
                }

                return {
                    ...state,
                    notifications,
                    unreadTabs,
                    lastNotificationId: id,
                };
            });
        },

        clearNotifications: (options) => {
            set((state) => {
                const notifications = { ...state.notifications };
                let accountFilter = { ...state.accountFilter };
                let dashboardFilter = { ...state.dashboardFilter };

                let lastNotificationId = state.lastNotificationId;

                switch (options.type) {
                    case "Account": {
                        if (
                            state.lastNotificationId &&
                            notifications.account[state.lastNotificationId]
                        ) {
                            lastNotificationId = undefined;
                        }
                        notifications.account = {};
                        accountFilter = {};

                        break;
                    }
                    case "Dashboard": {
                        if (
                            state.lastNotificationId &&
                            notifications.dashboard[state.lastNotificationId]
                        ) {
                            lastNotificationId = undefined;
                        }
                        notifications.dashboard = {};
                        dashboardFilter = {};
                        break;
                    }
                    case "All": {
                        lastNotificationId = undefined;
                        notifications.account = {};
                        notifications.dashboard = {};
                        dashboardFilter = {};
                        accountFilter = {};
                        break;
                    }
                }

                return {
                    ...state,
                    notifications,
                    lastNotificationId,
                    dashboardFilter,
                    accountFilter,
                };
            });
        },

        clearUnread: (options) => {
            set((state) => {
                const unreadTabs = { ...state.unreadTabs };

                delete unreadTabs[options.tab];

                return { ...state, unreadTabs };
            });
        },

        updatePreferences: (options) => {
            set((state) => {
                const preferences = { ...state.preferences };

                if ("visibility" in options) {
                    preferences.visibility = !!options.visibility;
                }

                return { ...state, preferences };
            });
        },

        setFilter: (options) => {
            set((state) => {
                let accountFilter = { ...state.accountFilter };
                let dashboardFilter = { ...state.dashboardFilter };

                switch (options.type) {
                    case "account-search": {
                        if (!(typeof options.search === "string")) {
                            throw "options.search is not a string.";
                        }

                        accountFilter = {
                            ...(accountFilter ?? {}),
                            search: options.search,
                        };
                        break;
                    }
                    case "account-sort": {
                        if (options.column?.length) {
                            accountFilter = {
                                ...(accountFilter ?? {}),
                                sorting: {
                                    ...(accountFilter?.sorting ?? {}),
                                    column: options.column[0],
                                },
                            };
                        }

                        if (options.direction) {
                            accountFilter = {
                                ...(accountFilter ?? {}),
                                sorting: {
                                    ...(accountFilter?.sorting ?? {}),
                                    direction: options.direction,
                                },
                            };
                        }
                        break;
                    }
                    case "account-filter": {
                        if (
                            !(
                                typeof options.flag === "boolean" &&
                                options.column?.length
                            )
                        ) {
                            throw "options/flag/column are not defined.";
                        }

                        for (const column of options.column) {
                            accountFilter = {
                                ...(accountFilter ?? {}),
                                filtering: {
                                    ...(accountFilter?.filtering ?? {}),
                                    [column]: options.flag,
                                },
                            };
                        }

                        break;
                    }
                    case "dashboard-search": {
                        if (!(typeof options.search === "string")) {
                            throw "options.search is not a string.";
                        }

                        dashboardFilter = {
                            ...(dashboardFilter ?? {}),
                            search: options.search,
                        };
                        break;
                    }
                    case "dashboard-sort": {
                        if (options.column?.length) {
                            dashboardFilter = {
                                ...(dashboardFilter ?? {}),
                                sorting: {
                                    ...(dashboardFilter?.sorting ?? {}),
                                    column: options.column[0],
                                },
                            };
                        }

                        if (options.direction) {
                            dashboardFilter = {
                                ...(dashboardFilter ?? {}),
                                sorting: {
                                    ...(dashboardFilter?.sorting ?? {}),
                                    direction: options.direction,
                                },
                            };
                        }
                        break;
                    }
                    case "dashboard-filter": {
                        if (
                            !(
                                typeof options.flag === "boolean" &&
                                options.column?.length
                            )
                        ) {
                            throw "options/flag/column are not defined.";
                        }

                        for (const column of options.column) {
                            dashboardFilter = {
                                ...(dashboardFilter ?? {}),
                                filtering: {
                                    ...(dashboardFilter?.filtering ?? {}),
                                    [column]: options.flag,
                                },
                            };
                        }

                        break;
                    }
                }

                return { ...state, dashboardFilter, accountFilter };
            });
        },

        toggleCollapsed: (options) => {
            switch (options.tab) {
                case "Account": {
                    set((state) => ({
                        ...state,
                        collapsedTabs: {
                            ...state.collapsedTabs,
                            account: !state.collapsedTabs.account,
                        },
                    }));
                    break;
                }
                case "Dashboard": {
                    set((state) => ({
                        ...state,
                        collapsedTabs: {
                            ...state.collapsedTabs,
                            dashboard: !state.collapsedTabs.dashboard,
                        },
                    }));
                    break;
                }
                case "All": {
                    set((state) => ({
                        ...state,
                        collapsedTabs: {
                            ...state.collapsedTabs,
                            all: !state.collapsedTabs.all,
                        },
                    }));
                    break;
                }
            }
        },
    };
};

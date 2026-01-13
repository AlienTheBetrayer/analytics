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
        theme: "dark",

        toggleTheme: () => {
            set((state) => ({
                ...state,
                theme: state.theme === "dark" ? "light" : "dark",
            }));
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
                    tab: options.tab,
                    type: options.type,
                    sentAt: new Date().toISOString(),
                };

                // storing it in memory
                switch (options.tab) {
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

        clearData: (options) => {
            set((state) => {
                switch (options.type) {
                    case "filters": {
                        if (!options.tab) {
                            throw "[tab] is undefined";
                        }

                        switch (options.tab) {
                            case "Account": {
                                let accountFilter = { ...state.accountFilter };
                                accountFilter = {
                                    filtering: undefined,
                                    search: undefined,
                                    sorting: undefined,
                                };
                                return { ...state, accountFilter };
                            }
                            case "Dashboard": {
                                let dashboardFilter = {
                                    ...state.dashboardFilter,
                                };
                                dashboardFilter = {
                                    filtering: undefined,
                                    search: undefined,
                                    sorting: undefined,
                                };
                                return { ...state, dashboardFilter };
                            }
                        }
                    }

                    case "unread": {
                        if (!options.tab) {
                            throw "[tab] is undefined";
                        }

                        const unreadTabs = { ...state.unreadTabs };

                        delete unreadTabs[options.tab];
                        return { ...state, unreadTabs };
                    }

                    case "notifications": {
                        if (!options.id?.length) {
                            throw "[id] is undefined";
                        }

                        const notifications = { ...state.notifications };
                        const lastNotificationId = options.id.includes(
                            state.lastNotificationId ?? ""
                        )
                            ? undefined
                            : state.lastNotificationId;

                        for (const id of options.id) {
                            delete notifications.account[id];
                            delete notifications.dashboard[id];
                        }

                        return { ...state, notifications, lastNotificationId };
                    }
                }
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
                    case "dashboard-filter-all": {
                        if (!(typeof options.flag === "boolean")) {
                            throw "options/flag are not defined.";
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
            }
        },
    };
};

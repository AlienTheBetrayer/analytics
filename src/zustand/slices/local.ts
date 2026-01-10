import {
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

                const id = crypto.randomUUID();

                const notification = {
                    id,
                    status: options.status,
                    description: options.description,
                    title: options.title,
                    sentAt: new Date().toISOString(),
                };

                switch (options.type) {
                    case "account": {
                        notifications.account = {
                            ...notifications.account,
                            [id]: notification,
                        };
                        unreadTabs.account = true;
                        break;
                    }
                    case "dashboard": {
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
                let lastNotificationId = state.lastNotificationId;

                switch (options.type) {
                    case "account": {
                        if (
                            state.lastNotificationId &&
                            notifications.account[state.lastNotificationId]
                        ) {
                            lastNotificationId = undefined;
                        }
                        notifications.account = {};
                        break;
                    }
                    case "dashboard": {
                        if (
                            state.lastNotificationId &&
                            notifications.dashboard[state.lastNotificationId]
                        ) {
                            lastNotificationId = undefined;
                        }
                        notifications.dashboard = {};
                        break;
                    }
                    case "all": {
                        lastNotificationId = undefined;
                        notifications.account = {};
                        notifications.dashboard = {};
                        break;
                    }
                }

                return { ...state, notifications, lastNotificationId };
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
    };
};

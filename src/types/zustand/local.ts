// /profiles/ url
export type ProfileMenuType = "desktop" | "mobile" | "compact";

// authentication optimization
export type VisibleProfile = {
    username: string;
    avatar_url?: string;
    color?: string;
};

// notifications
export type DashboardNotificationType = "information" | "error" | "warning";

export type DashboardNotification = {
    id: string;
    status: DashboardNotificationType;
    title?: string;
    description?: string;
    sentAt?: string;
};

export type LocalStore = {
    // notifications
    notifications: {
        dashboard: Record<string, DashboardNotification>;
        account: Record<string, DashboardNotification>;
    };
    lastNotificationId?: string;
    unreadTabs: Record<string, boolean>;
    preferences: {
        visibility: boolean;
    }

    // profiles
    profilesMenuType: ProfileMenuType;
    visibleProfile?: VisibleProfile;

    /**
     * sets the profile menu's type
     * @param type the new type for the profile menu
     */
    setProfilesMenuType: (type: ProfileMenuType) => void;

    /**
     * sets the visible profile (no authentication flicker)
     * @param profile the profile
     */
    setVisibleProfile: (visibleProfile?: VisibleProfile) => void;

    /**
     * pushes a new notification into an existing array of notifications
     * @param status status of the notification
     * @param title title of the notification
     * @param description description of the notification
     * @param type tab that receives the notification
     */
    pushNotification: (options: {
        status: DashboardNotificationType;
        title?: string;
        description?: string;
        type: "dashboard" | "account";
    }) => void;

    /**
     * explicitly clears all notifications that have been sent
     * @param type which tabs should be cleared
     */
    clearNotifications: (options: {
        type: "dashboard" | "account" | "all";
    }) => void;

    /**
     * clears the unread status on a given tab
     * @param tab tab on which you might have the unread status
     */
    clearUnread: (options: { tab: "dashboard" | "account" }) => void;

    /**
     * updates the preferences (don't provide a value if you want it unchanged)
     * @param visibility whether to show the notifications' popups
     */
    updatePreferences: (options: { visibility?: boolean }) => void;
};

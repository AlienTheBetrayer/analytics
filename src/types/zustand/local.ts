// /profiles/ url
export type ProfileMenuType = "desktop" | "mobile" | "compact";

// authentication optimization
export type VisibleProfile = {
    username: string;
    avatar_url?: string;
    color?: string;
};

// notifications
export type DashboardNotificationType = "Information" | "Error" | "Warning";

export type DashboardNotification = {
    id: string;
    status: DashboardNotificationType;
    title?: string;
    description?: string;
    sentAt?: string;
};

export type FilterColumn =
    | "Error"
    | "Warning"
    | "Information"
    | "Title"
    | "Description"
    | "Status"
    | "Sent Date";

// filters
export type AccountFilter = {
    sorting?: {
        column?: FilterColumn;
        direction?: "ascendant" | "descendant";
    };
    search?: string;
    filtering?: Record<string, boolean>;
};

export type DashboardFilter = {
    sorting?: {
        column?: FilterColumn;
        direction?: "ascendant" | "descendant";
    };
    search?: string;
    filtering?: Record<string, boolean>;
};

export type LocalStore = {
    // notifications
    notifications: {
        dashboard: Record<string, DashboardNotification>;
        account: Record<string, DashboardNotification>;
    };
    lastNotificationId?: string;
    unreadTabs: Record<string, boolean>;
    notificationListeners: Set<(notification: DashboardNotification) => void>; // doesn't hit the persistence, purely in memory

    // settings
    preferences: {
        visibility: boolean;
    };

    // filters
    accountFilter: AccountFilter;
    dashboardFilter: DashboardFilter;

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
        type: "Dashboard" | "Account";
    }) => void;

    /**
     * explicitly clears all notifications that have been sent
     * @param type which tabs should be cleared
     */
    clearNotifications: (options: {
        type: "Dashboard" | "Account" | "All";
    }) => void;

    /**
     * clears the unread status on a given tab
     * @param tab tab on which you might have the unread status
     */
    clearUnread: (options: { tab: "Dashboard" | "Account" }) => void;

    /**
     * updates the preferences (don't provide a value if you want it unchanged)
     * @param visibility whether to show the notifications' popups
     */
    updatePreferences: (options: { visibility?: boolean }) => void;

    /**
     * filter multi-function
     * @param events names of events to change visibility
     * @param flag a visibility flag
     */
    setFilter: (options: {
        type:
            | "account-sort"
            | "account-search"
            | "account-filter"
            | "dashboard-sort"
            | "dashboard-search"
            | "dashboard-filter";
        search?: string;
        column?: FilterColumn[];
        direction?: "ascendant" | "descendant";
        flag?: boolean;
    }) => void;

    /**
     * attaches function to the memory (will be called upon notification push)
     * @param callback the function that will be called upon new notification
     */
    addNotificationListener: (options: {
        callback: (notification: DashboardNotification) => void;
    }) => void;

    /**
     * detaches the callback from the memory
     * @param callback the function to remove from the listener memory
     */
    removeNotificationListener: (options: {
        callback: (notification: DashboardNotification) => void;
    }) => void;
};

import {
    Filter,
    NotificationTab,
    Notification,
    NotificationData,
} from "../other/notifications";

export type NotificationStore = {
    // notifications
    notifications: Record<NotificationTab, Record<string, Notification>>;
    lastNotificationId: string | null;

    // tabs
    unreadTabs: Record<NotificationTab, boolean>;
    expandedTabs: Record<NotificationTab, boolean>;

    // filters
    filter: Record<NotificationTab, Filter>;

    /**
     * pushes a new notification into an existing array of notifications
     * @param status status of the notification
     * @param title title of the notification
     * @param description description of the notification
     * @param type tab that receives the notification
     */
    pushNotification: (options: NotificationData) => void;

    /**
     * explicitly clears all notifications that have been sent
     * @param id which tabs should be cleared
     */
    clearData: (options: {
        type: "notifications" | "unread" | "filters";
        id?: string[];
        tab?: NotificationTab;
    }) => void;

    /**
     * filter multi-function
     * @param events names of events to change visibility
     * @param flag a visibility flag
     */
    setNotificationFilter: (options: {
        type: "sort" | "search" | "filter" | "filter-all";
        tab: NotificationTab;
        search?: string;
        column?: string[];
        direction?: "ascendant" | "descendant";
        flag?: boolean;
    }) => void;

    /**
     * toggles the collapsed state for the notification tab
     * @param tab the tab you want to hide / show
     * @param flag whether to collapse or expand
     */
    toggleCollapsed: (options: { tab: NotificationTab }) => void;
};

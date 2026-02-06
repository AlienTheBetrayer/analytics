// notifications
export type NotificationStatus = "Information" | "Error" | "Warning";
export type NotificationTab = "Account" | "Dashboard";
export type NotificationType =
    | "Analytics Sync"
    | "Profile Edit"
    | "Emulated"
    | "Post deleted"
    | "Post changed"
    | "Project deleted"
    | "Events deleted"
    | "Sessions terminated"
    | "Account deleted"
    | "Signed up"
    | "Profile modified"
    | "Feedback sent";

export type Notification = {
    id: string;
    status: NotificationStatus;
    tab: NotificationTab;
    type?: NotificationType;
    title: string;
    description?: string;
    sentAt?: string;
};

export type NotificationData = {
    title: string;
    status: NotificationStatus;
    tab: NotificationTab;
    type: NotificationType;
    description?: string;
};

// filters
export type Filter = {
    sorting: {
        column: string;
        direction: "ascendant" | "descendant";
    };
    search?: string;
    filtering?: Record<string, boolean>;
};

// notifications
export type NotificationStatus = "Information" | "Error" | "Warning";
export type NotificationTab = "Account" | "Dashboard";
export type NotificationType = "Analytics Sync" | "Profile Edit" | "Emulated";

export type Notification = {
    id: string;
    status: NotificationStatus;
    tab: NotificationTab;
    type?: NotificationType;
    title: string;
    description?: string;
    sentAt?: string;
};

export type NotificationPartial = {
    title: string;
    status: NotificationStatus;
    tab: NotificationTab;
    description?: string;
    type?: NotificationType;
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

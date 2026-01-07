import { Event } from "../tables/project";

// notifications
export type DashboardNotificationType = "information" | "error" | "warning";

export type DashboardNotification = {
    status: DashboardNotificationType;
    title: string;
    description?: string;
    createdAt?: Date;
};

export type ProjectColumns =
    | "Name"
    | "Created Date"
    | "Updated Date"
    | (string & {});
export type EventColumns =
    | "Type"
    | "Description"
    | "Created Date"
    | (string & {});

export type ProjectFilter = {
    projectSorting?: {
        column?: ProjectColumns;
        direction?: "ascendant" | "descendant";
    };
    projectSearch?: string;
};

export type EventFilter = Record<
    string,
    {
        eventsSorting?: {
            column?: EventColumns;
            direction?: "ascendant" | "descendant";
        };
        eventsSearch?: string;
        eventsFiltering?: Record<string, boolean>;
    }
>;

// the main type
export type DashboardStore = {
    // selectedProject
    selectedProjectId?: string;
    eventFilters: EventFilter;
    projectFilters: ProjectFilter;

    /**
     * filter multi-function
     * @param events names of events to change visibility
     * @param flag a visibility flag
     */
    setFilter: (options: {
        project_id: string;
        type:
            | "project-sort"
            | "project-search"
            | "event-sort"
            | "event-search"
            | "event-filter";
        search?: string;
        column?: (EventColumns | ProjectColumns)[];
        direction?: "ascendant" | "descendant";
        events?: Event[];
        flag?: boolean;
    }) => void;

    /**
     * Sets the currently selected project
     * @param idx a uuid of the project
     */
    selectProject: (idx: string | undefined) => void;

    /**
     * explicitly deselects a project that may have been selected
     */
    deselectProject: () => void;

    // notifications
    notifications: DashboardNotification[];

    /**
     * explicitly sets notifications array
     * @param notifications an array of notifications
     */
    setNotifications: (notifications: DashboardNotification[]) => void;

    /**
     * explicitly clears all notifications that have been sent
     */
    clearNotifications: () => void;

    /**
     * pushes a new notification into an existing array of notifications
     * @param notification a new notification
     */
    pushNotification: (notification: DashboardNotification) => void;
};

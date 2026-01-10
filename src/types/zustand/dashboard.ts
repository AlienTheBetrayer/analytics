import { Event } from "../tables/project";

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
};

import { Event } from "../tables/project";

export type ProjectFilter = {
    projectSorting?: {
        column?: string;
        direction?: "ascendant" | "descendant";
    };
    projectSearch?: string;
};

export type EventFilter = Record<
    string,
    {
        eventsSorting?: {
            column?: string;
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
    setDashboardFilter: (options: {
        project_id: string;
        type:
            | "project-sort"
            | "project-search"
            | "event-sort"
            | "event-search"
            | "event-filter";
        search?: string;
        column?: string[];
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

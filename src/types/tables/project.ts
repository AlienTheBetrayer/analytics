/**
 * events
 */
export type Event = {
    id: string;
    project_id: string;
    type?: string;
    description?: string;
    created_at?: string;
};

/**
 * project_aggregates
 */
export type Aggregate = {
    id: string;
    project_id: string;
    visits: number;
    last_updated_at?: string;
};

/**
 * projects
 */
export type Project = {
    id: string;
    name: string;
    created_at?: string;
    last_event_at?: string;
};

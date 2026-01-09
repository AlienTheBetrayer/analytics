import { Aggregate, Event, Project } from "@/types/tables/project";

/**
 * projects, events, aggregates
 */
export type ResponseSync = (Project & { events: Event[] } & {
    aggregates: Aggregate[];
})[];

export type ResponseSent = {
    event: Event;
    project: Project;
    aggregate: Aggregate;
};

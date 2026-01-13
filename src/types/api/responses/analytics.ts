import { Event, Project } from "@/types/tables/project";

/**
 * projects, events
 */
export type ResponseSync = (Project & { events: Event[] })[];

export type ResponseSent = {
    event: Event;
    project: Project;
};

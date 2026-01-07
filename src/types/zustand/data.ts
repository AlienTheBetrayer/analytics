/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PromiseStatuses } from "@/hooks/usePromiseStatus";
import { Aggregate, Event, Project } from "../tables/project";

export type DataStore = {
    // cache / promises
    promises: PromiseStatuses;
    cached?: Record<string, boolean>;

    // dashboard-related
    projects: Record<string, Project>;
    events: Record<string, Event[]>;
    aggregates: Record<string, Aggregate>;

    // cache / promises
    /**
     * Internally sets the promise status for each and every API request
     * @param key unique id for the promise
     * @param status status type
     */
    setPromise: (key: string, callback: () => Promise<any>) => Promise<any>;

    /**
     * syncs all data about projects and its events in a single query
     * @param promiseKey unique promise key for the promise status
     * @param caching whether to cache the data
     */
    sync: (options?: {
        promiseKey?: string;
        caching?: boolean;
    }) => Promise<void>;

    /**
     * deletes data (both from state and database)
     * @param id ids of the datas to delete
     * @param type the type of data to delete
     * @param promiseKey unique promise key for the promise status
     */
    deleteData: (options: {
        id: string[];
        type: "project" | "event";
        promiseKey?: string;
    }) => Promise<void>;

    /**
     * deletes all state data (only from state, not from the database)
     */
    deleteState: () => void;

    /**
     * artificially emulates an event
     * @param project_name the name of the project
     * @param event_type name of the event (type)
     * @param description description of the event
     * @param promiseKey unique promise key for the promise status
     */
    emulateEvent: (options: {
        project_name: string;
        event_type: string;
        description: string;
        promiseKey?: string;
    }) => Promise<void>;
};

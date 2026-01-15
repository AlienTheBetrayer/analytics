/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PromiseStatuses } from "@/hooks/usePromiseStatus";
import { Event, Project } from "../tables/project";
import { NotificationPartial } from "../other/notifications";

export type DataStore = {
    // cache / promises / other
    promises: PromiseStatuses;
    cached?: Record<string, boolean>;
    notificationListeners: Set<(event: NotificationPartial) => void>;

    // dashboard-related
    projects: Record<string, Project>;
    events: Record<string, Event[]>;

    /**
     * attaches function to the memory (will be called upon notification push)
     * @param callback the function that will be called upon new notification
     */
    addListener: (options: {
        callback: (event: NotificationPartial) => void;
    }) => void;
    /**
     * detaches the callback from the memory
     * @param callback the function to remove from the listener memory
     */
    removeListener: (options: {
        callback: (event: NotificationPartial) => void;
    }) => void;

    /**
     * runs through all the attached listener callbacks with the notification
     * @param notification the value to feed the listeners
     */
    runListeners: (options: { notification: NotificationPartial }) => void;

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

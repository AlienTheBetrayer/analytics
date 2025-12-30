import type { PromiseStatuses } from "@/hooks/usePromiseStatus";
import type { ProjectResponseData } from "../api/database";
import type { AnalyticsMeta } from "../api/database/analytics";
import type { Project, ProjectAggregate } from "../api/database/projects";
import { ResponseAxios } from "./utils/axios";

export type ProjectData = {
    project: Project;
    events: AnalyticsMeta[];
    aggregates?: ProjectAggregate;
};

/**
 * All currently fetched data
 * @type [id: string]: [data: ProjectData]
 */
export type Data = Record<string, ProjectData>;

export type DataStore = {
    data?: Data;
    promises: PromiseStatuses;
    cached?: Record<string, boolean>;

    /**
     * Internally sets the promise status for each and every API request
     * @param key unique id for the promise
     * @param status status type
     */
    setPromise: <T>(key: string, callback: () => Promise<T>) => Promise<T>;

    /**
     * Internally sets the cached state for the API request
     * @param key the unique identifier for the cache request
     * @param flag cached or not
     */
    setCached: (key: string, flag?: boolean) => void;

    /**
     * explicitly sets the data to a new record
     * @param newData a new data record
     */
    setData: (newData: Data) => void;

    /**
     * explicitly clears all the data
     */
    emptyData: () => void;

    /**
     * syncs all data about projects and its events in a single query
     * @returns a promise containing the data
     */
    syncData: () => Promise<ResponseAxios>;

    /**
     * fetches the project list
     * @returns a promise containing the project list array
     * @param caching don't fetch the data if it already has been fetched
     */
    updateProjectList: (caching?: boolean) => Promise<Project[] | undefined>;

    /**
     * fetches aggregates and events of this project
     * @param id the uuid of the project stored in the database and Project type
     * @param caching don't fetch the data if it already has been fetched
     * @returns a promise containing the project data for this id
     */
    updateProjectData: (id: string, caching?: boolean) => Promise<ProjectResponseData | undefined>;

    /**
     * deletes the project from state and database
     * @param id the id of the project
     * @returns a promise containing the response
     */
    deleteProject: (id: string) => Promise<ResponseAxios | undefined>;

    /**
     * deletes the event from state and database
     * @param id the id of the event
     * @returns a promise containing the response
     */
    deleteEvent: (id: string) => Promise<ResponseAxios | undefined>;

    /**
     * artificially emulates an event
     * @param project_name the name of the project
     * @param event_type name of the event (type)
     * @param description description of the event
     * @returns a promise containing the response
     */
    emulateEvent: (
        project_name: string,
        event_type: string,
        description: string,
    ) => Promise<ResponseAxios | undefined>;
};

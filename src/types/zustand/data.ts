import type { PromiseStatuses } from "@/hooks/usePromiseStatus";
import type { ProjectResponseData } from "../api/database";
import type { AnalyticsMeta } from "../api/database/analytics";
import type { Project, ProjectAggregate } from "../api/database/projects";

export type ProjectData = {
	project: Project;
	events?: AnalyticsMeta[];
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
	 * WIP
	 * @returns a promise containing the updated version of the data that had already been fetched before the call
	 */
	syncData: () => Promise<void>;

	/**
	 * updates or creates all projects and its names / other data
	 * @returns a promise containing the project list array
	 * @param caching don't fetch the data if it already has been fetched
	 */
	updateProjectList: (caching?: boolean) => Promise<Project[] | undefined>;

	/**
	 * updates or creates the data (events / aggregates) of a specific project
	 * @param id the uuid of the project stored in the database and Project type
	 * @param caching don't fetch the data if it already has been fetched
	 * @returns a promise containing the project data for this id
	 */
	updateProjectData: (
		id: string,
		caching?: boolean,
	) => Promise<ProjectResponseData | undefined>;
};

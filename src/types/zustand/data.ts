import type { PromiseStatus, PromiseStatuses } from "@/hooks/usePromiseStatus";
import type {
	AnalyticsMeta,
	Project,
	ProjectAggregate,
	ProjectResponseData,
} from "../api/database";

export type ProjectData = {
	project: Project;
	events?: AnalyticsMeta[];
	aggregates?: ProjectAggregate;
};

/**
 * All currently fetched data
 * @type [id: string]: [data: ProjectData]
 */
export type Data = Record<string, ProjectData> | null;

export type DataStore = {
	data: Data;
	dataPromises: PromiseStatuses | null;

	/**
	 * Internally sets the promise status for each and every API request (shouldn't be used by the user)
	 * @param key unique id for the promise
	 * @param status status type
	 */
	setDataPromise: (key: string, status: PromiseStatus) => void;

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
	 * @param fetchOnce don't fetch the data if it had already been fetched once (default = false)
	 */
	updateProjectList: (fetchOnce?: boolean) => Promise<Project[] | undefined>;

	/**
	 * updates or creates the data (events / aggregates) of a specific project
	 * @param id the uuid of the project stored in the database and Project type
	 * @param fetchOnce don't fetch the data if it had already been fetched once (default = false)
	 * @returns a promise containing the project data for this id
	 */
	updateProjectData: (
		id: string,
		fetchOnce?: boolean,
	) => Promise<ProjectResponseData | undefined>;
};

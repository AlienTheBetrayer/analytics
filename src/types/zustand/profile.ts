import type { PromiseStatus, PromiseStatuses } from "@/hooks/usePromiseStatus";
import type { Profile } from "../api/database/profiles";
import type { User } from "../api/database/user";
import type { ResponseAxios } from "./utils/axios";

export type Profiles = Record<string, { profile: Profile; user: User }>;

export type ProfileStore = {
	profiles: Profiles | null;
	profilePromises: PromiseStatuses | null;

	/**
	 * Internally sets the promise status for each and every API request (shouldn't be used by the user)
	 * @param key unique id for the promise
	 * @param status status type
	 */
	setProfilePromise: (key: string, status: PromiseStatus) => void;

	/**
	 * gets the user's profile by its id
	 * @param name the name of the user
	 * @returns a promise containing the response
	 */
	getProfile: (name: string, fetchOnce?: boolean) => Promise<ResponseAxios | undefined>;

    /**
     * Sets or updates the profile data at the given user
     * @param user_id the id of the user (not the profile)
     * @param data the data that has been changed (hence partial)
     * @returns a promise containing the response
     */
    setProfileData: (user: User, data: Partial<Profile>) => Promise<ResponseAxios>;
};

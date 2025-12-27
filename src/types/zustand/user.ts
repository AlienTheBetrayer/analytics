import type { Profile } from "../api/database/profiles";
import type { User } from "../api/database/user";
import type { ResponseAxios } from "./utils/axios";

export type Profiles = Record<string, { profile: Profile; user: User; }>;

export type Friends = Record<string, string[]>;
export type Requests = Record<string, string[]>;

export type UserStore = {
	profiles?: Profiles;
    friends?: Friends;
    friendRequests?: Requests;

	/**
	 * gets the user's profile by its name
	 * @param name the name of the user
	 * @param caching don't fetch the data if it has already been fetched
	 * @returns a promise containing the response
	 */
	getProfileByName: (
		id: string,
		caching?: boolean,
	) => Promise<ResponseAxios | undefined>;

	/**
	 * gets the user's profile by its id
	 * @param id the id of the user
	 * @param caching don't fetch the data if it has already been fetched
	 * @returns a promise containing the response
	 */
	getProfileById: (
		id: string,
		caching?: boolean,
	) => Promise<ResponseAxios | undefined>;

	/**
	 * sets or updates the profile data at the given user
	 * @param user the user object of the user (not the profile)
	 * @param data the data that has been changed (hence partial)
	 * @returns a promise containing the response
	 */
	setProfileData: (
		user: User,
		data: Partial<Profile>,
	) => Promise<ResponseAxios | undefined>;

	/**
	 * deletes the profile from state
	 * @param id the id of the user
	 */
	deleteProfileData: (id: string) => void;

    /**
     * gets all the friends that this user has
     * @param id the id of the user
	 * @param caching don't fetch the data if it has already been fetched
     * @returns a promise containing the response
     */
    getFriends: (id: string, caching?: boolean) => Promise<ResponseAxios | undefined>;

    /**
     * gets all the profiles available at the moment
	 * @param caching don't fetch the data if it has already been fetched
     * @returns a promise containing the response
     */
    getAllProfiles: (caching?: boolean) => Promise<ResponseAxios | undefined>;

    /**
     * sends a friend request to a specific user
     * @param from_id the id of the user that sends the request
     * @param to_id the id of the user that from_id is sending the request to
     * @returns a promise containing the response
     */
    sendFriendRequest: (from_id: string, to_id: string) => Promise<ResponseAxios>;
};

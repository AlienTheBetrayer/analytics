import type { Profile } from "../api/database/profiles";
import type { User } from "../api/database/user";
import type { ResponseAxios } from "./utils/axios";

export type Profiles = Record<string, { profile: Profile; user: User }>;

export type Friends = Record<string, string[]>;
export type Requests = { incoming: string[]; outcoming: string[] }; 
export type Colors = Record<string, Record<number, string>>;

export type UserStore = {
	profiles?: Profiles;
	friends?: string[];
	friendRequests?: Requests;
    colors?: Colors;

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
	 * sets or updates profile data at the given user (undefined empties)
	 * @param id the id of the user object of the user (not the profile)
	 * @param data the data that has been changed (hence partial)
	 * @returns a promise containing the response
	 */
	setProfileData: (
        id: string,
        data: Record<string, string | undefined>,
	) => Promise<ResponseAxios>;

	/**
	 * gets all the profiles with the specified user ids
	 * @param ids the array of the ids of the profiles you want to get
	 * @param caching don't fetch the data if it has already been fetched
	 * @param promiseKey a custom promise key to subscribe to promise changes
	 * @returns a promise containing the response
	 */
	getProfiles: (
		ids: string[],
		caching?: boolean,
		promiseKey?: string,
	) => Promise<ResponseAxios | undefined>;

	/**
	 * deletes the profile from state
	 * @param id the id of the user
	 */
	deleteProfileData: (id: string) => void;

	/**
	 * gets all the friends that we have (if logged in)
	 * @param caching don't fetch the data if it has already been fetched
	 * @returns a promise containing the response
	 */
	getFriends: (caching?: boolean) => Promise<ResponseAxios | undefined>;

	/**
	 * gets all the profiles of the user's friends
	 * @param id the id of the user
	 * @param caching don't fetch the data if it has already been fetched
	 * @returns a promise containing the response
	 */
	getFriendsProfiles: (
		id: string,
		caching?: boolean,
	) => Promise<ResponseAxios | undefined>;

	/**
	 * gets all the friend requests this user sent and received
	 * @param id the id of the user
	 * @param caching don't fetch the data if it has already been fetched
	 * @param promiseKey a custom promise key to subscribe to promise data
	 * @returns a promise containing the response
	 */
	getFriendRequests: (
		id: string,
		caching?: boolean,
		promiseKey?: string,
	) => Promise<ResponseAxios | undefined>;
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

	/**
	 * deletes a friend request (works in both sides)
	 * @param user1_id the id of the first user
	 * @param user2_id the id of the second user
	 * @returns a promise containing the response
	 */
	deleteFriendRequest: (
		user1_id: string,
		user2_id: string,
	) => Promise<ResponseAxios>;

	/**
	 * unfriends the user
	 * @param user1_id the user you don't want to be friends no more
	 * @param user2_id the second user you don't want to be friends no more
	 * @returns a promise containing the response
	 */
	unfriend: (user1_id: string, user2_id: string) => Promise<ResponseAxios>;

	/**
	 * unfriends everyone
	 * @param id the user you don't want to be friends no more
	 * @returns a promise containing the response
	 */
	unfriendEveryone: (id: string) => Promise<ResponseAxios>;

    /**
     * gets the colors the user had picked
     * @param id id of the user
     * @param caching caching the data
     * @returns a promise containing the response
     */
    getColors: (id: string, caching?: boolean) => Promise<ResponseAxios | undefined>;

    
    /**
     * sets the colors the user had picked
     * @param id id of the user
     * @param data the color slots
     * @returns a promise containing the response
     */
    setColors: (id: string, data: { slot: number, color: string}[] ) => Promise<ResponseAxios | undefined>;
};

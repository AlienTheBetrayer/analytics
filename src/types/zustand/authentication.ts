import type { PromiseStatus, PromiseStatuses } from "@/hooks/usePromiseStatus";
import type { ResponseAxios } from "./utils/axios";

export type PermissionRole = "user" | "admin" | null;

export type AuthenticationStatus = {
	isLoggedIn: boolean;
	role: PermissionRole;
};

export type AuthenticationStore = {
	// login status
	status: AuthenticationStatus | null;
	authenticationPromises: PromiseStatuses | null;

	/**
	 * Internally sets the promise status for each and every API request (shouldn't be used by the user)
	 * @param key unique id for the promise
	 * @param status status type
	 */
	setAuthenticationPromise: (key: string, status: PromiseStatus) => void;

	/**
	 * sets the current authentication status
	 * @param status a new status
	 */
	setStatus: (status: AuthenticationStatus) => void;

	/**
	 * tries to login the user and if successful sets the status
	 * @param username username from the authentication form
	 * @param password password from the authentication form
	 * @returns a promise with the axios response
	 */
	login: (username: string, password: string) => Promise<ResponseAxios>;

	/**
	 * tries to register the user
	 * @param username username from the authentication form
	 * @param password password from the authentication form
	 * @returns a promise with the axios response
	 */
	register: (username: string, password: string) => Promise<ResponseAxios>;

	/**
	 * logs out the current user (if the user is logged in) and empties the status
	 * @returns a promise with the axios response
	 */
	logout: () => Promise<ResponseAxios>;

	/**
	 * refreshes the user's authentication state and updates the internal status with it
	 * @returns a promise with the axios response
	 */
	refresh: () => Promise<ResponseAxios>;
};

import { AuthenticationToken } from "../api/authentication";
import type { ResponseAxios } from "./utils/axios";

export type AuthenticationSession = {
    id: string;
    isCurrent: boolean;
};

export type AuthenticationStore = {
    // login status
    status?: AuthenticationToken;
    runningSessions?: AuthenticationSession[];

    /**
     * sets the current authentication status
     * @param status a new status
     */
    setStatus: (status: AuthenticationToken) => void;

    /**
     * verifies the refresh token
     * @returns a promise containing the payload
     */
    getSession: () => Promise<ResponseAxios>;

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
     * Deletes the user from the database + its profile
     * @param id the id of the user
     * @returns a promise with the axios response
     */
    deleteUser: (id: string) => Promise<ResponseAxios>;

    /**
     * gets all the current up-running authentication systems of a user
     * @param id the id of the user
     * @param caching don't fetch the data if it has already been fetched
     * @returns a promise containing the response
     */
    getSessions: (
        id: string,
        caching?: boolean
    ) => Promise<ResponseAxios | undefined>;

    /**
     * deletes a specific session with the id, making the user with that session unable to login
     * @param id id of the session
     * @returns the promise containing the response
     */
    deleteSession: (id: string) => Promise<ResponseAxios>;

    /**
     * terminates all sessions of the current user
     * @returns a promise containing the response
     */
    terminateAllSessions: () => Promise<ResponseAxios>;

    /**
     * terminates all sessions of the current user except the current
     * @returns a promise containing the response
     */
    terminateOtherSessions: () => Promise<ResponseAxios>;

    /**
     * changes the password of the user with the id
     * @param id an id of the user
     * @param password a new password
     * @returns a promise containing the response
     */
    changePassword: (id: string, password: string) => Promise<ResponseAxios>;
};

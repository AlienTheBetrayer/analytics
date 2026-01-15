import { ResponseLogin, ResponseSession } from "../api/responses/auth";
import { AuthenticationToken } from "../auth/authentication";

export type Status = AuthenticationToken & {};

export type AuthenticationStore = {
    // login status
    status: Status | undefined;
    sessions: Record<string, ResponseSession[]>;

    /**
     * sets the current authentication status
     * @param status a new status
     */
    setStatus: (status: AuthenticationToken) => void;

    /**
     * gets all the current up-running authentication systems of a user
     * @param user_id the id of the user
     * @param caching don't fetch the data if it has already been fetched
     * @param promiseKey a custom key for the promise status
     */
    getSessions: (options: {
        user_id?: string;
        type: "current" | "all";
        caching?: boolean;
        promiseKey?: string;
    }) => Promise<ResponseSession[] | AuthenticationToken | undefined>;

    /**
     * deletes sessions with those ids making the user with that session unable to login
     * @param id ids of the session
     * @param user_id the id of the user
     * @param promiseKey a custom key for the promise status
     */
    terminateSessions: (options: {
        user_id: string;
        ids: string[];
        promiseKey?: string;
    }) => Promise<void>;

    /**
     * tries to login the user and if successful sets the status
     * @param username username from the authentication form
     * @param password password from the authentication form
     * @returns a promise with the axios response
     */
    login: (username: string, password: string) => Promise<ResponseLogin>;

    /**
     * tries to register the user
     * @param username username from the authentication form
     * @param password password from the authentication form
     * @returns a promise with the axios response
     */
    register: (username: string, password: string) => Promise<ResponseLogin>;

    /**
     * logs out the current user (if the user is logged in) and empties the status
     * @returns a promise with the axios response
     */
    logout: (options?: { promiseKey?: string }) => Promise<void>;

    /**
     * Deletes the user from the database + its profile
     * @param id the id of the user
     * @returns a promise with the axios response
     */
    deleteUser: (id: string) => Promise<void>;
};

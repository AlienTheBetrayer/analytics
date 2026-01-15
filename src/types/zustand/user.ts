import { CachedUser } from "../api/responses/users";
import { Profile, ProfileGender, User } from "../tables/account";

export type UserStore = {
    users: Record<string, User>;
    profiles: Record<string, Profile>;
    friends: Record<string, Set<string>>;
    friendRequests: Record<
        string,
        { incoming: Set<string>; outcoming: Set<string> }
    >;
    colors: Record<string, { slot: number; color: string }[]>;

    /**
     * gets all the users and their data with filtering options
     * @param id the ids of the users to fetch
     * @param username the usernames of the users to fetch
     * @param select select filtering
     * @param promiseKey custom promise key to get promise data
     * @param caching whether to cache
     * @returns cached user object array with everything in it
     */
    getUsers: (options: {
        id?: string[];
        username?: string[];
        select?: (
            | "user"
            | "profile"
            | "colors"
            | "friends"
            | "friend_requests"
        )[];
        promiseKey?: string;
        caching?: boolean;
    }) => Promise<CachedUser[] | undefined>;

    /**
     * sets or updates user data at the given user
     * @param id the id of the user object of the user (not the profile)
     * @param data the data that has been changed (hence partial)
     * @param promiseKey a unique key for the promise status
     */
    updateUser: (options: {
        id: string;
        data: {
            name?: string;
            title?: string;
            status?: string;
            bio?: string;
            colors?: { slot: number; color: string }[];
            color?: string;
            gender?: ProfileGender;
            avatar_url?: string | null;
            avatar_name?: string;
            avatar_type?: string;
            role?: string;
            password?: string;
            username?: string;
        };
        promiseKey?: string;
    }) => Promise<void>;

    /**
     * sends/rejects a friend request and adds/removes from friends
     * @param from_id the id of the user that sends the request
     * @param to_id the id of the user that from_id is sending the request to
     * @param type the type of the request
     * @param promiseKey a unique key for the promise status
     */
    modifyFriendship: (options: {
        from_id: string;
        to_id?: string;
        type:
            | "request-send"
            | "request-accept"
            | "request-reject"
            | "unfriend"
            | "unfriend-all";
        promiseKey?: string;
    }) => Promise<void>;
};

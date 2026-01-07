import { Color, Friend, FriendRequest, Profile, User } from "@/types/tables/account";

/**
 * response type for /api/users/
 */
export type ResponseUsersAPI = User & {
    friends1?: Friend[];
    friends2?: Friend[];
    incoming?: FriendRequest[];
    outcoming?: FriendRequest[];
    profile?: Profile;
    colors?: Color[];
}

export type ResponseUsers = User & {
    friends?: string[];
    incoming?: string[];
    outcoming?: string[];
    profile?: Profile;
    colors?: Color[];
}

export type CachedUser = User & {
    friends?: Set<string>;
    incoming?: Set<string>;
    outcoming?: Set<string>;
    profile?: Profile;
    colors?: Color[];
}
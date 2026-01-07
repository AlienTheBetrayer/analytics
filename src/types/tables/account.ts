/**
 * profiles
 */
export type Profile = {
    id: string;
    user_id: string;
    name?: string;
    title?: string;
    status?: string;
    bio?: string;
    color?: string;
    avatar_url?: string;
};

/**
 * friend_requests
 */
export type FriendRequest = {
    id: string;
    from_id: string;
    to_id: string;
};

/**
 * friends
 */
export type Friend = {
    id: string;
    user1_id: string;
    user2_id: string;
};

/**
 * colors
 */
export type Color = {
    id: string;
    user_id: string;
    slot: number;
    color: string;
};

/**
 * users
 */
export type User = {
    id: string;
    username: string;
    password?: string;
    role: string;
    created_at?: string;
    last_seen_at?: string;
};

/**
 * a record to help with select filter
 */
export const includeMap: Record<string, string> = {
    profile: "profile:profiles(*)",
    colors: "colors:colors(*)",
    friends: `friends1: friends!friends_user1_id_fkey(*),
friends2: friends!friends_user2_id_fkey(*)`,
    friend_requests: `outcoming: friend_requests!friend_requests_from_id_fkey(*), incoming: friend_requests!friend_requests_to_id_fkey(*)`,
};

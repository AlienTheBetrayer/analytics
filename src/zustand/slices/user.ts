import { ResponseUsers } from "@/types/api/responses/users";
import { APIResponseType } from "@/types/response";
import type { UserStore } from "@/types/zustand/user";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const UserSlice: SliceFunction<UserStore> = (set, get) => {
    return {
        colors: {},
        friendRequests: {},
        friends: {},
        profiles: {},
        users: {},

        getUsers: async (options) => {
            const {
                setPromise,
                profiles,
                users,
                colors,
                friends,
                friendRequests,
            } = get();

            const ids = new Set<string>(
                (options.caching ?? true) ? [] : options.id
            );
            const usernames = new Set<string>(
                (options.caching ?? true) ? [] : options.username
            );

            // caching
            if (options.caching ?? true) {
                // if we prefer name-based filtering - get those ids
                const existingUsernames = new Map<string, string>(
                    Object.values(users).map(({ id, username }) => [
                        username,
                        id,
                    ])
                );

                const cacheFilter = (type: "id" | "name") => {
                    for (const entry of (type === "id"
                        ? options.id
                        : options.username) ?? []) {
                        for (const selection of options.select ?? ["user"]) {
                            switch (selection) {
                                case "profile": {
                                    if (type === "id") {
                                        if (!profiles[entry]) {
                                            ids.add(entry);
                                        }
                                    } else {
                                        const id = existingUsernames.get(entry);
                                        if (!id || !profiles[id]) {
                                            usernames.add(entry);
                                        }
                                    }
                                    break;
                                }
                                case "user": {
                                    if (type === "id") {
                                        if (!users[entry]) {
                                            ids.add(entry);
                                        }
                                    } else {
                                        const id = existingUsernames.get(entry);
                                        if (!id || !users[id]) {
                                            usernames.add(entry);
                                        }
                                    }
                                    break;
                                }
                                case "friend_requests": {
                                    if (type === "id") {
                                        if (!friendRequests[entry]) {
                                            ids.add(entry);
                                        }
                                    } else {
                                        const id = existingUsernames.get(entry);
                                        if (!id || !friendRequests[id]) {
                                            usernames.add(entry);
                                        }
                                    }
                                    break;
                                }
                                case "friends": {
                                    if (type === "id") {
                                        if (!friends[entry]) {
                                            ids.add(entry);
                                        }
                                    } else {
                                        const id = existingUsernames.get(entry);
                                        if (!id || !friends[id]) {
                                            usernames.add(entry);
                                        }
                                    }
                                    break;
                                }
                                case "colors": {
                                    if (type === "id") {
                                        if (!colors[entry]) {
                                            ids.add(entry);
                                        }
                                    } else {
                                        const id = existingUsernames.get(entry);
                                        if (!id || !colors[id]) {
                                            usernames.add(entry);
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                };

                if (options.id?.length) {
                    cacheFilter("id");
                } else if (options.username?.length) {
                    cacheFilter("name");
                }
            }

            if (!ids.size && !usernames.size) {
                return;
            }

            // request
            return await setPromise(
                options.promiseKey ?? "getUsers",
                async () => {
                    const res = await refreshedRequest(
                        "/api/users/",
                        "GET",
                        undefined,
                        {
                            params: {
                                id: [...ids].join(",") || undefined,
                                username: [...usernames].join(",") || undefined,
                                type:
                                    (options.select ?? ["user"])?.join(",") ||
                                    undefined,
                            },
                        }
                    );

                    const data = res.data.users as ResponseUsers[];

                    if (!data) {
                        return;
                    }

                    set((state) => {
                        const friends = { ...state.friends };
                        const profiles = { ...state.profiles };
                        const users = { ...state.users };
                        const friendRequests = { ...state.friendRequests };
                        const colors = { ...state.colors };

                        data.forEach((user) => {
                            if (user.friends) {
                                friends[user.id] = new Set([
                                    ...(friends[user.id] ?? []),
                                    ...(user.friends ?? []),
                                ]);
                            }

                            if (user.colors) {
                                colors[user.id] = user.colors;
                            }

                            if (user.profile) {
                                profiles[user.id] = user.profile;
                            }

                            if (user.incoming || user.outcoming) {
                                friendRequests[user.id] = {
                                    incoming: new Set([
                                        ...(friendRequests[user.id]?.incoming ??
                                            []),
                                        ...(user.incoming ?? []),
                                    ]),
                                    outcoming: new Set([
                                        ...(friendRequests[user.id]
                                            ?.outcoming ?? []),
                                        ...(user.outcoming ?? []),
                                    ]),
                                };
                            }

                            users[user.id] = {
                                id: user.id,
                                role: user.role,
                                username: user.username,
                                created_at: user.created_at,
                                last_seen_at: user.last_seen_at,
                            };
                        });

                        return {
                            ...state,
                            friends,
                            profiles,
                            colors,
                            users,
                            friendRequests,
                        };
                    });

                    return data.map(
                        ({
                            id,
                            role,
                            username,
                            colors,
                            friends,
                            created_at,
                            incoming,
                            outcoming,
                            last_seen_at,
                            profile,
                        }) => ({
                            id,
                            role,
                            username,
                            colors,
                            created_at,
                            last_seen_at,
                            profile,
                            friends: new Set([...(friends ?? [])]),
                            incoming: new Set([...(incoming ?? [])]),
                            outcoming: new Set([...(outcoming ?? [])]),
                        })
                    );
                }
            );
        },

        updateUser: async (options) => {
            const { setPromise, runListeners, users } = get();

            await setPromise(options.promiseKey ?? "updateUser", async () => {
                set((state) => {
                    const profiles = { ...state.profiles };
                    const colors = { ...state.colors };
                    const users = { ...state.users };

                    if (!profiles[options.id]) {
                        return state;
                    }

                    // users
                    if ("role" in options.data) {
                        users[options.id].role = options.data.role ?? "user";
                    }

                    // colors
                    if (options.data.colors) {
                        colors[options.id] = options.data.colors;
                    }

                    // profiles
                    if ("color" in options.data) {
                        profiles[options.id].color = options.data.color;
                    }

                    if ("name" in options.data) {
                        profiles[options.id].name = options.data.name ?? "";
                    }

                    if ("status" in options.data) {
                        profiles[options.id].status = options.data.status ?? "";
                    }

                    if ("bio" in options.data) {
                        profiles[options.id].bio = options.data.bio ?? "";
                    }

                    if ("title" in options.data) {
                        profiles[options.id].title = options.data.title ?? "";
                    }

                    if ("gender" in options.data) {
                        profiles[options.id].gender =
                            options.data.gender ?? "unspecified";
                    }

                    return { ...state, profiles, colors, users };
                });

                try {
                    const res = await refreshedRequest(
                        "/api/user-update",
                        "POST",
                        {
                            user_id: options.id,
                            ...options.data,
                        }
                    );

                    runListeners({
                        notification: {
                            status: "Information",
                            title: `Updated ${users[options.id].username}!`,
                            description:
                                "Any data may have been changed regarding this user.",
                            tab: "Account",
                            type: "PROFILE_EDITED",
                        },
                    });

                    return res;
                } catch (e) {
                    runListeners({
                        notification: {
                            status: "Error",
                            title: `Failed updating ${users[options.id].username}.`,
                            description: JSON.stringify(e),
                            tab: "Account",
                            type: "PROFILE_EDITED",
                        },
                    });
                }
            });
        },

        modifyFriendship: async (options) => {
            const { setPromise } = get();

            return await setPromise(
                options.promiseKey ?? "modifyFriendship",
                async () => {
                    try {
                        const res = await refreshedRequest(
                            "/api/friend/",
                            "POST",
                            {
                                from_id: options.from_id,
                                to_id: options.to_id,
                                type: options.type ?? "request-send",
                            }
                        );

                        switch (res.data.type as APIResponseType) {
                            case "friend_request_accepted": {
                                set((state) => {
                                    if (!options.to_id) {
                                        return state;
                                    }

                                    const friendRequests = {
                                        ...state.friendRequests,
                                    };
                                    const friends = { ...state.friends };

                                    friendRequests[
                                        options.from_id
                                    ]?.incoming?.delete(options.to_id);
                                    friendRequests[
                                        options.to_id
                                    ]?.incoming?.delete(options.from_id);
                                    friendRequests[
                                        options.from_id
                                    ]?.outcoming?.delete(options.to_id);
                                    friendRequests[
                                        options.to_id
                                    ]?.outcoming?.delete(options.from_id);

                                    friends[options.from_id] = new Set([
                                        ...(friends[options.from_id] ?? []),
                                        options.to_id,
                                    ]);
                                    friends[options.to_id] = new Set([
                                        ...(friends[options.to_id] ?? []),
                                        options.from_id,
                                    ]);

                                    return {
                                        ...state,
                                        friendRequests,
                                        friends,
                                    };
                                });
                                break;
                            }
                            case "friend_request_sent": {
                                set((state) => {
                                    if (!options.to_id) {
                                        return state;
                                    }

                                    const friendRequests = {
                                        ...state.friendRequests,
                                    };

                                    friendRequests[options.from_id] = {
                                        outcoming: new Set([
                                            ...(friendRequests[options.from_id]
                                                ?.outcoming ?? []),
                                            options.to_id,
                                        ]),
                                        incoming: new Set([
                                            ...(friendRequests[options.from_id]
                                                ?.incoming ?? []),
                                        ]),
                                    };

                                    friendRequests[options.to_id] = {
                                        outcoming: new Set([
                                            ...(friendRequests[options.to_id]
                                                ?.outcoming ?? []),
                                        ]),
                                        incoming: new Set([
                                            ...(friendRequests[options.to_id]
                                                ?.incoming ?? []),
                                            options.from_id,
                                        ]),
                                    };

                                    return { ...state, friendRequests };
                                });
                                break;
                            }
                            case "friend_request_rejected": {
                                set((state) => {
                                    if (!options.to_id) {
                                        return state;
                                    }

                                    const friendRequests = {
                                        ...state.friendRequests,
                                    };

                                    friendRequests[
                                        options.from_id
                                    ]?.incoming?.delete(options.to_id);
                                    friendRequests[
                                        options.to_id
                                    ]?.incoming?.delete(options.from_id);
                                    friendRequests[
                                        options.from_id
                                    ]?.outcoming?.delete(options.to_id);
                                    friendRequests[
                                        options.to_id
                                    ]?.outcoming?.delete(options.from_id);

                                    return { ...state, friendRequests };
                                });
                                break;
                            }
                            case "unfriended": {
                                set((state) => {
                                    if (!options.to_id) {
                                        return state;
                                    }

                                    const friends = { ...state.friends };
                                    const fromFriends = new Set(
                                        friends[options.from_id]
                                    );
                                    fromFriends.delete(options.to_id);
                                    friends[options.from_id] = fromFriends;

                                    const toFriends = new Set(
                                        friends[options.to_id]
                                    );
                                    toFriends.delete(options.from_id);
                                    friends[options.to_id] = toFriends;

                                    return { ...state, friends };
                                });
                                break;
                            }
                            case "all_unfriended": {
                                set((state) => {
                                    const friends = { ...state.friends };
                                    delete friends[options.from_id];

                                    return { ...state, friends };
                                });
                                break;
                            }
                        }
                    } catch (e) {
                        throw e;
                    }
                }
            );
        },
    };
};

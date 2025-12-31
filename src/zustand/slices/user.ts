import type { Color } from "@/types/api/database/colors";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import type { APIResponseType } from "@/types/api/response";
import type { UserStore } from "@/types/zustand/user";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { refreshedRequest } from "@/utils/refreshedRequest";

export const UserSlice: SliceFunction<UserStore> = (set, get) => {
    return {
        getProfileByName: async (name: string, caching: boolean = true) => {
            const { setPromise, profiles } = get();

            if (caching === true && profiles) {
                const found = Object.values(profiles).find((p) => p.user.username === name);

                if (found) return;
            }

            return await setPromise("profile", async () => {
                const res = await refreshedRequest(`/api/profile?name=${name}`, "GET");

                set((state) => {
                    const newProfiles = { ...(state.profiles ?? {}) };
                    newProfiles[res.data.user.id] = {
                        profile: res.data.profile,
                        user: res.data.user,
                    };

                    return { ...state, profiles: newProfiles };
                });

                return res;
            });
        },

        getProfileById: async (id: string, caching: boolean = true) => {
            const { setPromise, profiles } = get();

            if (caching === true && profiles?.[id] !== undefined) return;

            return await setPromise("profile", async () => {
                const res = await refreshedRequest(`/api/profile?id=${id}`, "GET");

                set((state) => {
                    const newProfiles = { ...(state.profiles ?? {}) };
                    newProfiles[id] = {
                        profile: res.data.profile,
                        user: res.data.user,
                    };

                    return { ...state, profiles: newProfiles };
                });

                return res;
            });
        },

        setProfileData: async (id: string, data: Record<string, string | undefined>) => {
            const { setPromise } = get();

            return await setPromise("profile_set", async () => {
                const res = await refreshedRequest("/api/profile/set", "POST", {
                    user_id: id,
                    ...data,
                });

                set((state) => {
                    const newProfiles = { ...(state.profiles ?? {}) };

                    newProfiles[id] = {
                        ...newProfiles[id],
                        profile: { ...newProfiles[id].profile, ...data },
                    };

                    return { ...state, profiles: newProfiles };
                });

                return res;
            });
        },

        deleteProfileData: (id: string) => {
            set((state) => {
                const newProfiles = { ...(state.profiles ?? {}) };
                delete newProfiles[id];

                return { ...state, profiles: newProfiles };
            });
        },

        getFriends: async (caching: boolean = true) => {
            const { setPromise, setCached, cached, status } = get();

            if ((caching === true && cached?.friends !== undefined) || status === undefined) return;

            return await setPromise("friends", async () => {
                const res = await refreshedRequest(`/api/friends/${status.user.id}`, "GET");
                const data = res.data as { friends: { id: string }[] };

                set((state) => ({ ...state, friends: data.friends.map((f) => f.id) }));

                setCached("friends");
                return res;
            });
        },

        getFriendsProfiles: async (id: string, caching: boolean = true) => {
            const { setPromise, setCached, cached } = get();

            if (caching === true && cached?.friends_profiles !== undefined) return;

            return await setPromise("friends", async () => {
                const res = await refreshedRequest(`/api/friend-profiles/${id}`, "GET");
                const data = res.data as {
                    profiles: { profile: Profile; user: User }[];
                };

                set((state) => {
                    const profiles = { ...state.profiles };

                    data.profiles.forEach((p) => {
                        profiles[p.user.id] = p;
                    });

                    return {
                        ...state,
                        profiles,
                        friends: data.profiles.map((p) => p.user.id),
                    };
                });

                setCached("friends_profiles");
                return res;
            });
        },

        getFriendRequests: async (
            id: string,
            caching: boolean = true,
            promiseKey: string = "friend_requests",
        ) => {
            const { setPromise, setCached, cached } = get();

            if (caching === true && cached?.friend_requests !== undefined) return;

            return await setPromise(promiseKey, async () => {
                const res = await refreshedRequest(`/api/friend-requests/${id}`, "GET");
                const data = res.data.requests as {
                    id: string;
                    from_id: string;
                    to_id: string;
                }[];

                set((state) => {
                    const friendRequests: { incoming: string[]; outcoming: string[] } = {
                        incoming: [],
                        outcoming: [],
                    };

                    data.forEach((request) => {
                        if (request.to_id === id) {
                            // incoming
                            friendRequests.incoming.push(request.from_id);
                        } else {
                            // outcoming
                            friendRequests.outcoming.push(request.to_id);
                        }
                    });

                    return { ...state, friendRequests };
                });

                setCached("friend_requests");
                return res;
            });
        },

        getAllProfiles: async (caching: boolean = true) => {
            const { setPromise, cached, setCached } = get();

            if (caching === true && cached?.profiles !== undefined) return;

            return await setPromise("profiles", async () => {
                const res = await refreshedRequest("/api/profiles/", "GET");
                const data = res.data as {
                    profiles: { profile: Profile; user: User }[];
                };

                set((state) => {
                    const profiles = { ...state.profiles };

                    data.profiles.forEach((p) => {
                        profiles[p.user.id] = p;
                    });

                    return { ...state, profiles };
                });

                setCached("profiles");
                return res;
            });
        },

        sendFriendRequest: async (from_id: string, to_id: string) => {
            const { setPromise } = get();

            return await setPromise("friend_request", async () => {
                try {
                    const res = await refreshedRequest("/api/friend-request/", "POST", {
                        from_id,
                        to_id,
                    });
                    const responseStatus = res.data.type as APIResponseType;

                    switch (responseStatus) {
                        case "friend_request_accepted":
                            set((state) => {
                                return {
                                    ...state,
                                    friendRequests: state.friendRequests
                                        ? {
                                              incoming: state.friendRequests.incoming.filter(
                                                  (id) => id !== from_id && id !== to_id,
                                              ),
                                              outcoming: state.friendRequests.incoming.filter(
                                                  (id) => id !== from_id && id !== to_id,
                                              ),
                                          }
                                        : undefined,
                                    friends: [...(state.friends ?? []), to_id],
                                };
                            });
                            break;
                        case "friend_request_sent":
                            set((state) => {
                                return {
                                    ...state,
                                    friendRequests: {
                                        outcoming: [
                                            ...(state.friendRequests?.outcoming ?? []),
                                            to_id,
                                        ],
                                        incoming: state.friendRequests?.incoming ?? [],
                                    },
                                };
                            });
                            break;
                    }

                    return res;
                } catch (e) {
                    throw e;
                }
            });
        },

        deleteFriendRequest: async (user1_id: string, user2_id: string) => {
            const { setPromise } = get();

            return await setPromise("delete_friend_request", async () => {
                const res = await refreshedRequest("/api/friend-request-reject/", "POST", {
                    user1_id,
                    user2_id,
                });

                set((state) => {
                    if (!state.friendRequests) return state;

                    const friendRequests = { ...state.friendRequests };
                    friendRequests.incoming = friendRequests.incoming.filter(
                        (id) => id !== user1_id && id !== user2_id,
                    );
                    friendRequests.outcoming = friendRequests.outcoming.filter(
                        (id) => id !== user1_id && id !== user2_id,
                    );

                    return { ...state, friendRequests };
                });

                return res;
            });
        },

        unfriend: async (user1_id: string, user2_id: string) => {
            const { setPromise } = get();

            return await setPromise("unfriend", async () => {
                const res = await refreshedRequest("/api/unfriend/", "POST", {
                    user1_id,
                    user2_id,
                });

                set((state) => ({
                    ...state,
                    friends: state.friends?.filter((f) => f !== user1_id && f !== user2_id),
                }));

                return res;
            });
        },

        unfriendEveryone: async (id: string) => {
            const { setPromise } = get();

            return await setPromise("unfriend_everyone", async () => {
                const res = await refreshedRequest("/api/unfriend-all/", "POST", { id });

                set((state) => ({
                    ...state,
                    friends: undefined,
                }));

                return res;
            });
        },

        getProfiles: async (
            ids: string[],
            caching: boolean = true,
            promiseKey: string = "profiles",
        ) => {
            const { setPromise, profiles } = get();

            let fetchIds: string[] = ids;

            if (caching) {
                if (profiles === undefined) return;

                fetchIds = fetchIds.filter((id) => profiles[id] === undefined);
                if (fetchIds.length === 0) return;
            }

            return await setPromise(promiseKey, async () => {
                const res = await refreshedRequest("/api/profiles-select/", "POST", {
                    ids: fetchIds,
                });

                const data = res.data as {
                    profiles: { profile: Profile; user: User }[];
                };

                set((state) => {
                    const profiles = { ...state.profiles };

                    data.profiles.forEach((p) => {
                        profiles[p.user.id] = p;
                    });

                    return {
                        ...state,
                        profiles,
                    };
                });

                return res;
            });
        },

        getColors: async (id: string, caching: boolean = true) => {
            const { setPromise, colors } = get();

            if (caching === true && colors?.[id]) {
                return;
            }

            return await setPromise("colors", async () => {
                const res = await refreshedRequest(`/api/colors/${id}`, "GET");
                const data = res.data as { colors: Color[] };

                set((state) => {
                    const colors = { ...(state.colors ?? {}) };
                    data.colors.forEach(({ slot, color }) => {
                        colors[id] ??= {};
                        colors[id][slot] = color;
                    });

                    return { ...state, colors };
                });

                return res;
            });
        },

        setColors: async (id: string, data: { slot: number; color: string }[]) => {
            const { setPromise } = get();

            if (data.length === 0) {
                return;
            }

            return await setPromise("set_colors", async () => {
                const res = await refreshedRequest("/api/colors-save/", "POST", {
                    id,
                    data,
                });

                set((state) => {
                    const colors = { ...state.colors };

                    data.forEach(({ slot, color }) => {
                        colors[slot] = color;
                    });

                    return { ...state, colors };
                });

                return res;
            });
        },
    };
};

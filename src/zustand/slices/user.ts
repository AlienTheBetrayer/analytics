import axios from "axios";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import type { APIResponseType } from "@/types/api/response";
import type { UserStore } from "@/types/zustand/user";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";

export const UserSlice: SliceFunction<UserStore> = (set, get) => {
	return {
		getProfileByName: async (name: string, caching: boolean = true) => {
			const { setPromise, profiles } = get();

			if (caching === true && profiles) {
				const found = Object.values(profiles).find(
					(p) => p.user.username === name,
				);

				if (found) return;
			}

			return await setPromise("profile", async () => {
				const res = await axios.get(`/api/profile?name=${name}`);

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
				const res = await axios.get(`/api/profile?id=${id}`);

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

		setProfileData: async (user: User, data: Partial<Profile>) => {
			const { setPromise } = get();

			return await setPromise("profile_set", async () => {
				const res = await axios.post("/api/profile/update", {
					user_id: user.id,
					...data,
				});

				set((state) => {
					const newProfiles = { ...(state.profiles ?? {}) };

					newProfiles[user.id] = {
						...newProfiles[user.id],
						profile: { ...newProfiles[user.id].profile, ...data },
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

			if (
				(caching === true && cached?.friends !== undefined) ||
				status === undefined
			)
				return;

			return await setPromise("friends", async () => {
				const res = await axios.get(`/api/friends/${status.user.id}`);
				const data = res.data as { friends: { id: string }[] };

				set((state) => ({ ...state, friends: data.friends.map((f) => f.id) }));

				setCached("friends");
				return res;
			});
		},

		getFriendsProfiles: async (id: string, caching: boolean = true) => {
			const { setPromise, setCached, cached } = get();

			if (
				(caching === true && cached?.friends_profiles !== undefined)
			)
				return;

			return await setPromise("friends", async () => {
				const res = await axios.get(`/api/friend-profiles/${id}`);
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

		getFriendRequests: async (id: string, caching: boolean = true) => {
			const { setPromise, setCached, cached } = get();

            if (
				(caching === true && cached?.friends_profiles !== undefined)
			)
				return;

			return await setPromise("friend_requests", async () => {
				const res = await axios.get(`/api/friend-requests/${id}`);
                const data = res.data.requests as { incoming: string[], outcoming: string []};
                console.log(data);

				set((state) => {
					const friendRequests = { ...state.friendRequests };

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
				const res = await axios.get("/api/profiles/");
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
					const res = await axios.post("/api/friend-request/", {
						from_id,
						to_id,
					});
					const responseStatus = res.data.type as APIResponseType;

					switch (responseStatus) {
						case "friend_request_accepted":
							set((state) => {
								const friendRequests = { ...state.friendRequests };
								friendRequests[from_id] = friendRequests[from_id]?.filter(
									(id) => id !== to_id,
								);
								friendRequests[to_id] = friendRequests[to_id]?.filter(
									(id) => id !== from_id,
								);

								return {
									...state,
									friendRequests,
									friends: [...(state.friends ?? []), to_id],
								};
							});
							break;
						case "friend_request_sent":
							set((state) => {
								const friendRequests = { ...state.friendRequests };
								friendRequests[to_id] = [
									...(friendRequests[to_id] ?? []),
									from_id,
								];

								return { ...state, friendRequests };
							});
							break;
					}

					return res;
				} catch (e) {
					throw e;
				}
			});
		},

		unfriend: async (id: string) => {
			const { setPromise } = get();

			return await setPromise("unfriend", async () => {
				const res = await axios.post("/api/unfriend/", { id });

				set((state) => ({
					...state,
					friends: state.friends?.filter((f) => f !== id),
				}));

				return res;
			});
		},

		unfriendEveryone: async (id: string) => {
			const { setPromise } = get();

			return await setPromise("unfriend_everyone", async () => {
				const res = await axios.post("/api/unfriend-all/", { id });

				set((state) => ({
					...state,
					friends: undefined,
				}));

				return res;
			});
		},
	};
};

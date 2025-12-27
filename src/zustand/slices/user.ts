import axios from "axios";
import type { Friend } from "@/types/api/database/friends";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import type { Profiles, UserStore } from "@/types/zustand/user";
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

		getFriends: async (id: string, caching: boolean = true) => {
			const { setPromise, friends } = get();

			if (caching === true && friends?.[id] !== undefined) return;

			return await setPromise("friends", async () => {
				const res = await axios.get(`/api/auth/friends/${id}`);
				const data = res.data as Friend[];

				set((state) => ({
					...state,
					friends: { ...state.friends, [id]: res.data },
				}));

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
					const profiles = data.profiles.reduce<Profiles>((acc, item) => {
						acc[item.user.id] = item;
						return acc;
					}, {});

					return { ...state, profiles };
				});
                
                setCached("profiles", true);
				return res;
			});
		},
	};
};

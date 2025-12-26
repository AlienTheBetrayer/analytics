import axios from "axios";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import type { ProfileStore } from "@/types/zustand/profile";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { promiseStatus } from "@/utils/promiseStatus";

export const ProfileSlice: SliceFunction<ProfileStore> = (set, get) => {
	return {
		profiles: null,
		profilePromises: null,

		setProfilePromise: (key, status) => {
			set((state) => ({
				...state,
				profilePromises: {
					...state.profilePromises,
					[key]: status,
				},
			}));
		},

		getProfileByName: async (name: string, fetchOnce: boolean = true) => {
			const { setProfilePromise, profiles } = get();

			if (fetchOnce === true && profiles) {
				const found = Object.values(profiles).find(
					(p) => p.user.username === name,
				);

				if (found) return;
			}

			return await promiseStatus(
				"profile",
				async () => {
					const res = await axios.get(`/api/profile?name=${name}`);

					set((state) => {
						const newProfiles = { ...state.profiles };
						newProfiles[res.data.user.id] = {
							profile: res.data.profile,
							user: res.data.user,
						};

						return { ...state, profiles: newProfiles };
					});

					return res;
				},
				setProfilePromise,
			);
		},

		getProfileById: async (id: string, fetchOnce: boolean = true) => {
			const { setProfilePromise, profiles } = get();

			if (fetchOnce === true && profiles?.[id] !== undefined) return;

			return await promiseStatus(
				"profile",
				async () => {
					const res = await axios.get(`/api/profile?id=${id}`);

					set((state) => {
						const newProfiles = { ...state.profiles };
						newProfiles[id] = {
							profile: res.data.profile,
							user: res.data.user,
						};

						return { ...state, profiles: newProfiles };
					});

					return res;
				},
				setProfilePromise,
			);
		},

		setProfileData: async (user: User, data: Partial<Profile>) => {
			const { setProfilePromise } = get();

			return await promiseStatus(
				"profile_set",
				async () => {
					const res = await axios.post("/api/profile/update", {
						user_id: user.id,
						...data,
					});

					set((state) => {
						const newProfiles = { ...state.profiles };
						newProfiles[user.username] = {
							...newProfiles[user.username],
							profile: { ...newProfiles[user.username].profile, ...data },
						};

						return { ...state, profiles: newProfiles };
					});

					return res;
				},
				setProfilePromise,
			);
		},

		deleteProfileData: (id: string) => {
			set((state) => {
				const newProfiles = { ...(state.profiles ?? {}) };
				delete newProfiles[id];

				return { ...state, profiles: newProfiles };
			});
		},
	};
};

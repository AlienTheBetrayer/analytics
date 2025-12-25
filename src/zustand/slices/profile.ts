import axios from "axios";
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
				authenticationPromises: {
					...state.profilePromises,
					[key]: status,
				},
			}));
		},

		getProfile: async (name: string) => {
			const { setProfilePromise } = get();

            return await promiseStatus(
				"profile",
				async () => {
					const res = await axios.get(`/api/profile/${name}`);

					set((state) => {
						const newProfiles = { ...state.profiles };
						newProfiles[name] = {
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
	};
};

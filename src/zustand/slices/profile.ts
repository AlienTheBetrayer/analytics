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

		getProfile: async (name: string, fetchOnce: boolean = true) => {
			const { setProfilePromise, profiles } = get();

            if(fetchOnce === true && profiles?.[name] !== undefined)
                return;

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

		setProfileData: async (user: User, data: Partial<Profile>) => {
			const { setProfilePromise } = get();

			return await promiseStatus(
				"profile_set",
				async () => {
                    const res = await axios.post("/api/profile/update", {
                        user_id: user.id,
                        ...data
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
	};
};

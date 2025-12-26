import axios from "axios";
import type { AuthenticationStore } from "@/types/zustand/authentication";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";

export const AuthenticationSlice: SliceFunction<AuthenticationStore> = (
	set,
	get,
) => {
	return {
		setStatus: (status) => {
			set((state) => ({ ...state, status }));
		},

		register: async (username, password) => {
			const { setPromise } = get();

			return await setPromise("register", async () => {
				const res = await axios.post("/api/auth/register", {
					username,
					password,
				});

				return res;
			});
		},

		login: async (username, password) => {
			const { setPromise } = get();

			return await setPromise("login", async () => {
				const res = await axios.post("/api/auth/login", {
					username,
					password,
				});

				set((state) => ({
					...state,
					status: { isLoggedIn: true, user: res.data.user },
				}));

				return res;
			});
		},

		logout: async () => {
			const { setPromise, status } = get();

			return await setPromise("logout", async () => {
				const res = await axios.post("/api/auth/logout");
				set((state) => {
					const newProfiles = { ...(state.profiles ?? {}) };
					if (status !== undefined) {
						delete newProfiles[status.user.id];
					}

					return { ...state, status: undefined, profiles: newProfiles };
				});

				return res;
			});
		},

		refresh: async () => {
			const { setPromise } = get();

			return await setPromise("refresh", async () => {
				try {
					const res = await axios.post("/api/auth/refresh");

					set((state) => ({
						...state,
						status: { isLoggedIn: true, user: res.data.user },
					}));

					return res;
				} catch (e) {
					set((state) => ({
						...state,
						status: undefined,
					}));
					throw e;
				}
			});
		},

		deleteUser: async (id: string) => {
			const { setPromise } = get();

			return await setPromise("delete", async () => {
				return await axios.post("/api/auth/delete", { id });
			});
		},
	};
};

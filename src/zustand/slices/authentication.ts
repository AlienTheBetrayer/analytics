import axios from "axios";
import type { AuthenticationStore } from "@/types/zustand/authentication";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { promiseStatus } from "@/utils/promiseStatus";

export const AuthenticationSlice: SliceFunction<AuthenticationStore> = (
	set,
	get,
) => {
	return {
		// data controllers
		status: null,
		authenticationPromises: null,

		setAuthenticationPromise: (key, status) => {
			set((state) => ({
				...state,
				authenticationPromises: {
					...state.authenticationPromises,
					[key]: status,
				},
			}));
		},

		setStatus: (status) => {
			set((state) => ({ ...state, status }));
		},

		register: async (username, password) => {
			const { setAuthenticationPromise } = get();

			return await promiseStatus(
				"register",
				async () => {
					const res = await axios.post("/api/auth/register", {
						username,
						password,
					});

					return res;
				},
				setAuthenticationPromise,
			);
		},

		login: async (username, password) => {
			const { setAuthenticationPromise } = get();

			return await promiseStatus(
				"login",
				async () => {
					const res = await axios.post("/api/auth/login", {
						username,
						password,
					});

					set((state) => ({
						...state,
						status: { isLoggedIn: true, user: res.data.user },
					}));

					return res;
				},
				setAuthenticationPromise,
			);
		},

		logout: async () => {
			const { setAuthenticationPromise } = get();

			return await promiseStatus(
				"logout",
				async () => {
					const res = await axios.post("/api/auth/logout");
					set((state) => ({
						...state,
						status: null,
					}));

					return res;
				},
				setAuthenticationPromise,
			);
		},

		refresh: async () => {
			const { setAuthenticationPromise } = get();

			return await promiseStatus(
				"refresh",
				async () => {
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
							status: null,
						}));
						throw e;
					}
				},
				setAuthenticationPromise,
			);
		},
	};
};

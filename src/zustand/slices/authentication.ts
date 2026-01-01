import axios from "axios";
import type {
    AuthenticationSession,
    AuthenticationStore,
} from "@/types/zustand/authentication";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { refreshedRequest } from "@/utils/refreshedRequest";
import { User } from "@/types/api/database/user";
import { AuthenticationToken } from "@/types/api/authentication";

export const AuthenticationSlice: SliceFunction<AuthenticationStore> = (
    set,
    get
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
                const data = res.data as {
                    user: User;
                    payload: AuthenticationToken;
                };
                const {
                    id,
                    role,
                    session_id,
                    username: payloadUsername,
                } = data.payload;

                set((state) => ({
                    ...state,
                    status: { id, role, session_id, username: payloadUsername },
                }));

                return res;
            });
        },

        logout: async () => {
            const { setPromise, status } = get();

            return await setPromise("logout", async () => {
                const res = await refreshedRequest("/api/auth/logout", "POST");
                set((state) => {
                    const newProfiles = { ...(state.profiles ?? {}) };
                    if (status !== undefined) {
                        delete newProfiles[status.id];
                    }

                    return {
                        ...state,
                        profiles: newProfiles,
                        status: undefined,
                        sessions: undefined,
                        friends: undefined,
                        cached: undefined,
                        colors: undefined,
                    };
                });

                return res;
            });
        },

        deleteUser: async (id: string) => {
            const { setPromise } = get();

            return await setPromise("delete", async () => {
                const res = await refreshedRequest("/api/auth/delete", "POST", {
                    id,
                });

                set((state) => {
                    const profiles = { ...state.profiles };
                    delete profiles[id];
                    return { ...state, profiles };
                });

                return res;
            });
        },

        getSessions: async (id: string, caching: boolean = true) => {
            const { setPromise, runningSessions } = get();

            if (caching === true && runningSessions !== undefined) return;

            return await setPromise("sessions", async () => {
                const res = await refreshedRequest(
                    `/api/auth/sessions/${id}`,
                    "GET"
                );
                const data = res.data as {
                    sessions: AuthenticationSession[];
                };

                set((state) => ({
                    ...state,
                    runningSessions: data.sessions,
                }));

                return res;
            });
        },

        deleteSession: async (id: string) => {
            const { setPromise } = get();

            return await setPromise(`session_logout_${id}`, async () => {
                const res = await refreshedRequest(
                    `/api/auth/logout/${id}`,
                    "POST"
                );

                set((state) => ({
                    ...state,
                    runningSessions: state.runningSessions?.filter(
                        (s) => s.id !== id
                    ),
                }));

                return res;
            });
        },

        terminateAllSessions: async () => {
            const { setPromise } = get();
            return await setPromise(`sessions_terminate`, async () => {
                const res = await refreshedRequest(
                    `/api/auth/terminate/`,
                    "POST"
                );

                set((state) => ({
                    ...state,
                    runningSessions: undefined,
                    status: undefined,
                }));

                return res;
            });
        },

        terminateOtherSessions: async () => {
            const { setPromise } = get();

            return await setPromise(`sessions_terminate`, async () => {
                const res = await refreshedRequest(
                    `/api/auth/terminate?type=other`,
                    "POST"
                );

                set((state) => ({
                    ...state,
                    runningSessions: state.runningSessions?.filter(
                        (s) => s.isCurrent
                    ),
                }));

                return res;
            });
        },

        changePassword: async (id: string, password: string) => {
            const { setPromise } = get();

            return await setPromise(`password_change`, async () => {
                return await refreshedRequest(
                    `/api/auth/password-change/`,
                    "POST",
                    {
                        id,
                        password,
                    }
                );
            });
        },

        getSession: async () => {
            try {
                const res = await axios.get("/api/auth/session");
                const data = res.data as { payload: AuthenticationToken };
                const { id, role, session_id, username } = data.payload;

                set((state) => ({
                    ...state,
                    status: { id, role, session_id, username },
                }));

                return res;
            } catch (e) {
                throw { e };
            }
        },
    };
};

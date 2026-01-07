import axios from "axios";
import type { AuthenticationStore } from "@/types/zustand/authentication";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";
import { AuthenticationToken } from "@/types/auth/authentication";
import { ResponseLogin, ResponseSession } from "@/types/api/responses/auth";

export const AuthenticationSlice: SliceFunction<AuthenticationStore> = (
    set,
    get
) => {
    return {
        sessions: {},

        setStatus: (status) => {
            set((state) => ({ ...state, status }));
        },

        getSessions: async (options) => {
            const { setPromise, sessions } = get();

            // caching / invalidating
            if (
                (options.caching ?? true) &&
                options.user_id &&
                options.type !== "current" &&
                sessions[options.user_id]
            ) {
                return;
            }

            if (!options.user_id && options.type === "all") {
                throw "[getSessions]: user_id is missing.";
            }

            return await setPromise(
                options.promiseKey ?? "getSessions",
                async () => {
                    const res = await refreshedRequest(
                        `/api/auth/sessions`,
                        "GET",
                        undefined,
                        {
                            params: {
                                user_id: options.user_id,
                                type: options.type ?? "all",
                            },
                        }
                    );

                    if (options.user_id) {
                        const data = res.data.sessions as ResponseSession[];
                        const id = options.user_id;

                        set((state) => ({
                            ...state,
                            sessions: {
                                ...state.sessions,
                                [id]: data,
                            },
                        }));

                        return data;
                    } else {
                        const session = res.data.session as AuthenticationToken;

                        set((state) => ({
                            ...state,
                            status: session,
                        }));

                        return session;
                    }
                }
            );
        },

        terminateSessions: async (options) => {
            const { setPromise } = get();

            return await setPromise(
                options.promiseKey ?? "terminateSessions",
                async () => {
                    await refreshedRequest(`/api/auth/terminate/`, "POST", {
                        user_id: options.user_id,
                        ids: options.ids,
                    });

                    set((state) => {
                        const sessions = { ...state.sessions };

                        sessions[options.user_id] = sessions[
                            options.user_id
                        ].filter((sid) => !options.ids.includes(sid.id));

                        return { ...state, sessions };
                    });
                }
            );
        },

        register: async (username, password) => {
            const { setPromise } = get();

            return await setPromise("register", async () => {
                const res = await axios.post("/api/auth/register", {
                    username,
                    password,
                });

                return res.data as ResponseLogin;
            });
        },

        login: async (username, password) => {
            const { setPromise } = get();

            return await setPromise("login", async () => {
                const res = await axios.post("/api/auth/login", {
                    username,
                    password,
                });

                const data = res.data as ResponseLogin;

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

                return data;
            });
        },

        logout: async (options) => {
            const { setPromise } = get();

            return await setPromise(
                options?.promiseKey ?? "logout",
                async () => {
                    await refreshedRequest("/api/auth/logout", "POST");

                    set((state) => ({ ...state, status: undefined }));
                }
            );
        },

        deleteUser: async (id: string) => {
            const { setPromise } = get();

            return await setPromise("delete", async () => {
                await refreshedRequest("/api/auth/delete", "POST", {
                    id,
                });

                set((state) => {
                    const profiles = { ...state.profiles };
                    const users = { ...state.users };
                    const colors = { ...state.colors };
                    const friendRequests = { ...state.friendRequests };
                    const friends = { ...state.friends };

                    delete profiles[id];
                    delete users[id];
                    delete colors[id];
                    delete friendRequests[id];
                    delete friends[id];

                    return {
                        ...state,
                        profiles,
                        users,
                        colors,
                        friendRequests,
                        friends,
                    };
                });
            });
        },
    };
};

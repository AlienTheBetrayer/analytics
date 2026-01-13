import { ResponseSent, ResponseSync } from "@/types/api/responses/analytics";
import type { DataStore } from "@/types/zustand/data";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const DataSlice: SliceFunction<DataStore> = (set, get) => {
    return {
        promises: {},
        events: {},
        projects: {},
        notificationListeners: new Set(),

        addListener: (options) => {
            set((state) => {
                const notificationListeners = new Set(
                    state.notificationListeners
                );
                notificationListeners.add(options.callback);

                return { ...state, notificationListeners };
            });
        },

        removeListener: (options) => {
            set((state) => {
                const notificationListeners = new Set(
                    state.notificationListeners
                );
                notificationListeners.delete(options.callback);

                return { ...state, notificationListeners };
            });
        },

        runListeners: (options) => {
            const { notificationListeners } = get();

            for (const listener of notificationListeners) {
                listener(options.notification);
            }
        },

        setPromise: async (key, callback) => {
            set((state) => ({
                ...state,
                promises: { ...state.promises, [key]: "pending" },
            }));

            try {
                const res = await callback();
                set((state) => ({
                    ...state,
                    promises: { ...state.promises, [key]: "resolved" },
                }));
                setTimeout(() => {
                    set((state) => ({
                        ...state,
                        promises: { ...state.promises, [key]: "idle" },
                    }));
                }, 5000);
                return res;
            } catch (error) {
                console.error(error);
                set((state) => ({
                    ...state,
                    promises: { ...state.promises, [key]: "rejected" },
                }));
                setTimeout(() => {
                    set((state) => ({
                        ...state,
                        promises: { ...state.promises, [key]: "idle" },
                    }));
                }, 5000);
                return error;
            }
        },

        deleteData: async (options) => {
            const { setPromise } = get();

            return await setPromise(
                options?.promiseKey ?? "deleteEvent",
                async () => {
                    await refreshedRequest("/api/analytics/delete/", "POST", {
                        id: options.id,
                        type: options.type,
                    });

                    set((state) => {
                        switch (options.type) {
                            case "event": {
                                const events = { ...state.events };

                                for (const [id, stateEvents] of Object.entries(
                                    events
                                )) {
                                    events[id] = stateEvents.filter(
                                        (e) => !options.id.includes(e.id)
                                    );
                                }

                                return { ...state, events };
                            }
                            case "project": {
                                const projects = { ...state.projects };
                                const events = { ...state.events };

                                for (const id of options.id) {
                                    delete projects[id];
                                    delete events[id];
                                }

                                return {
                                    ...state,
                                    projects,
                                    events,
                                    selectedProjectId: undefined,
                                };
                            }
                        }
                    });
                }
            );
        },

        deleteState: () => {
            set((state) => ({
                ...state,
                projects: {},
                events: {},
                selectedProjectId: undefined,
            }));
        },

        sync: async (options) => {
            const { setPromise, projects, runListeners } = get();

            if ((options?.caching ?? true) && Object.values(projects).length) {
                return;
            }

            return await setPromise(options?.promiseKey ?? "sync", async () => {
                try {
                    const res = await refreshedRequest(
                        "/api/analytics/sync",
                        "GET"
                    );

                    runListeners({
                        notification: {
                            status: "Information",
                            title: "Analytics data synced!",
                            description:
                                "Full analytics data has just been synced and is ready for use.",
                            tab: "Dashboard",
                            type: "ANALYTICS_SYNCED",
                        },
                    });

                    const data = res.data as ResponseSync;

                    set((state) => {
                        const projects = { ...state.projects };
                        const events = { ...state.events };

                        for (const entry of Object.values(data)) {
                            projects[entry.id] = {
                                id: entry.id,
                                name: entry.name,
                                created_at: entry.created_at,
                                last_event_at: entry.last_event_at,
                            };

                            if (entry.events) {
                                events[entry.id] = entry.events;
                            }
                        }

                        return { ...state, projects, events };
                    });
                } catch (e) {
                    runListeners({
                        notification: {
                            status: "Error",
                            title: "Failed syncing analytics.",
                            description: JSON.stringify(e),
                            tab: "Dashboard",
                            type: "ANALYTICS_SYNCED",
                        },
                    });
                }
            });
        },

        emulateEvent: async (options) => {
            const { setPromise } = get();
            return await setPromise(
                options.promiseKey ?? "emulateEvent",
                async () => {
                    const res = await refreshedRequest(
                        "/api/analytics/send",
                        "POST",
                        {
                            project_name: options.project_name,
                            event_type: options.event_type,
                            description: options.description,
                        }
                    );

                    const data = res.data.sent as ResponseSent;

                    set((state) => {
                        const projects = { ...state.projects };
                        const events = { ...state.events };

                        projects[data.project.id] = data.project;
                        events[data.project.id] = [
                            ...(events?.[data.project.id] ?? []),
                            data.event,
                        ];

                        return { ...state, projects, events };
                    });
                }
            );
        },
    };
};

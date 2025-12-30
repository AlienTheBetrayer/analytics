import type { ProjectResponseData } from "@/types/api/database";
import { Analytics, AnalyticsMeta } from "@/types/api/database/analytics";
import type { Project } from "@/types/api/database/projects";
import type { Data, DataStore } from "@/types/zustand/data";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { refreshedRequest } from "@/utils/refreshedRequest";
import axios from "axios";

export const DataSlice: SliceFunction<DataStore> = (set, get) => {
    return {
        promises: {},

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
            } catch (e) {
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
                throw e;
            }
        },

        setCached: (key: string, flag: boolean = true) => {
            set((state) => ({ ...state, cached: { ...state.cached, [key]: flag } }));
        },

        setData: (newData) => {
            set((state) => ({ ...state, data: newData }));
        },

        emptyData: () => {
            set((state) => ({ ...state, data: undefined }));
        },

        updateProjectList: async (caching: boolean = false) => {
            const { data, setPromise } = get();

            if (caching === true && data !== undefined) return;

            return await setPromise("projects", async () => {
                const projects = (await refreshedRequest("/api/analytics/projects/", "GET"))
                    .data as Project[];
                set((state) => {
                    const newData = { ...(state.data ?? {}) };

                    for (const project of Object.values(projects)) {
                        newData[project.id] = {
                            ...newData[project.id],
                            events:
                                newData[project.id]?.events?.length > 0
                                    ? newData[project.id].events
                                    : [],
                            project,
                        };
                    }

                    return { ...state, data: newData };
                });

                return projects;
            });
        },

        updateProjectData: async (id: string, caching: boolean = false) => {
            const { data, setPromise } = get();

            if (caching === true && data?.[id]?.events?.length !== 0) {
                return;
            }

            return await setPromise(id, async () => {
                const projectData = (await refreshedRequest(`/api/analytics/project/${id}/`, "GET"))
                    .data as ProjectResponseData;

                set((state) => {
                    if (state.data?.[projectData.id] === undefined) {
                        return state;
                    }

                    const newData = { ...(state.data ?? {}) };

                    newData[projectData.id] = {
                        ...newData[projectData.id],
                        events: projectData.metaData ?? [],
                        aggregates: projectData.aggregates,
                    };

                    return {
                        ...state,
                        data: newData,
                    };
                });

                return projectData;
            });
        },

        deleteProject: async (id: string) => {
            const { setPromise } = get();

            return await setPromise("project_delete", async () => {
                const res = await axios.post("/api/analytics/delete-project/", { project_id: id });

                set((state) => {
                    const data = { ...state.data };
                    delete data[id];

                    return { ...state, data };
                });

                return res;
            });
        },

        deleteEvent: async (id: string) => {
            const { setPromise } = get();

            return await setPromise(`event_delete_${id}`, async () => {
                const res = await axios.post("/api/analytics/delete-event/", { id });

                set((state) => {
                    const data = { ...state.data };

                    for (const [projectId, projectData] of Object.entries(data)) {
                        const events = projectData.events?.filter((e) => e.id !== id);
                        data[projectId].events = events;
                    }

                    return { ...state, data };
                });

                return res;
            });
        },

        emulateEvent: async (project_name, event_type, description) => {
            const { setPromise } = get();

            return await setPromise("emulate", async () => {
                const res = await axios.post("/api/analytics/send", {
                    project_name,
                    event_type,
                    description,
                });

                return res;
            });
        },

        syncData: async () => {
            const { setPromise, updateProjectList, emptyData } = get();
            emptyData();

            const { data: stateData } = get();

            return await setPromise("sync", async () => {
                await updateProjectList(false);
                const res = await axios.get("/api/sync");
                const data = res.data as (Analytics & { event: AnalyticsMeta; project: Project })[];

                set((state) => {
                    const newData: Data = stateData ?? {};

                    for (const entry of Object.values(data)) {
                        newData[entry.project.id] = {
                            ...newData[entry.project.id],
                            project: entry.project,
                        };

                        if (!newData[entry.project.id].events) {
                            newData[entry.project.id].events = [];
                        }

                        newData[entry.project.id].events = [
                            ...newData[entry.project.id].events,
                            entry.event,
                        ];
                    }

                    return { ...state, data: newData };
                });

                return res;
            });
        },
    };
};

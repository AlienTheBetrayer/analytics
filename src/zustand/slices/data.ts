import type { ProjectResponseData } from "@/types/api/database";
import type { Project } from "@/types/api/database/projects";
import type { DataStore } from "@/types/zustand/data";
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
            const { data } = get();
            if (data === undefined) {
                return;
            }

            set((state) => ({ ...state, data: undefined }));
        },

        syncData: async () => {
            const { setPromise } = get();

            return await setPromise("sync", async () => {});
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

            if (caching === true && data?.[id]?.events !== undefined) return;

            return await setPromise(id, async () => {
                const projectData = (
                    await refreshedRequest(`/api/analytics/project/${id}/`, "GET")
                ).data as ProjectResponseData;

                set((state) => {
                    if (state.data?.[projectData.id] === undefined) return state;

                    const newData = { ...(state.data ?? {}) };

                    newData[projectData.id] = {
                        ...newData[projectData.id],
                        events: projectData.metaData,
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

        emulateEvent: async (project_name, event_type, description) => {
            const { setPromise } = get();

            return await setPromise("emulate", async() => {
                const res = await axios.post("/api/analytics/send", {
                    project_name, event_type, description
                });

                return res;
            }); 
        }
    };
};

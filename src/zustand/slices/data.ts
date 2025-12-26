import type { ProjectResponseData } from "@/types/api/database";
import type { Project } from "@/types/api/database/projects";
import type { DataStore } from "@/types/zustand/data";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { refreshedRequest } from "@/utils/refreshedRequest";

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
				return res;
			} catch (e) {
				set((state) => ({
					...state,
					promises: { ...state.promises, [key]: "rejected" },
				}));
				throw e;
			}
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

		updateProjectList: async (fetchOnce: boolean = false) => {
			const { data, setPromise } = get();

			if (fetchOnce === true && data !== undefined) return;

			return await setPromise("projects", async () => {
				const projects = (
					await refreshedRequest("/api/analytics/user/projects/", "GET")
				).data as Project[];
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

		updateProjectData: async (id: string, fetchOnce: boolean = false) => {
			const { data, setPromise } = get();

			if (fetchOnce === true && data?.[id]?.events !== undefined) return;

			return await setPromise(id, async () => {
				const projectData = (
					await refreshedRequest(`/api/analytics/user/project/${id}/`, "GET")
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
	};
};

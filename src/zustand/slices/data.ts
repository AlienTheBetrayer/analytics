import type { Project, ProjectResponseData } from "@/src/types/api/database";
import type { DataStore } from "@/src/types/zustand/data";
import type { SliceFunction } from "@/src/types/zustand/utils/sliceFunction";
import { promiseStatus } from "@/src/utils/promiseStatus";
import { refreshedRequest } from "@/src/utils/refreshedRequest";

export const DataSlice: SliceFunction<DataStore> = (set, get) => {
	return {
		data: null,
		dataPromises: null,

		setData: (newData) => {
			set((state) => ({ ...state, data: newData }));
		},

		emptyData: () => {
			const { data } = get();
			if (data === null) {
				return;
			}

			set((state) => ({ ...state, data: null }));
		},

		setDataPromise: (key, status) => {
			set((state) => ({
				...state,
				dataPromises: { ...state.dataPromises, [key]: status },
			}));
		},

		syncData: async () => {
			const { setDataPromise } = get();

			return await promiseStatus("sync", async () => {}, setDataPromise);
		},

		updateProjectList: async (fetchOnce: boolean = false) => {
			const { data, setDataPromise } = get();

			if (fetchOnce === true && data !== null) return;

			return await promiseStatus(
				"projects",
				async () => {
					const projects = (
						await refreshedRequest("/api/analytics/user/projects/", "GET")
					).data as Project[];
					set((state) => {
						const newData = { ...state.data };

						for (const project of Object.values(projects)) {
							newData[project.id] = {
								...newData[project.id],
								project,
							};
						}

						return { ...state, data: newData };
					});

					return projects;
				},
				setDataPromise,
			);
		},

		updateProjectData: async (id: string, fetchOnce: boolean = false) => {
			const { data, setDataPromise } = get();

			if (fetchOnce === true && data?.[id]?.events !== undefined) return;

			return await promiseStatus(
				id,
				async () => {
					const projectData = (
						await refreshedRequest(`/api/analytics/user/project/${id}/`, "GET")
					).data as ProjectResponseData;

					set((state) => {
						const newData = { ...state.data };

						newData[projectData.id] = {
							...newData[projectData.id],
							events: projectData.metaData,
							aggregates: projectData.aggregates,
						};

						return { ...state, data: newData };
					});

					return projectData;
				},
				setDataPromise,
			);
		},
	};
};

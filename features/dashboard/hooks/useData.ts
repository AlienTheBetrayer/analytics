import type {
	AnalyticsMetaType,
	ProjectAggregatesType,
	ProjectDataType,
	ProjectType,
} from "@/app/types/database";
import { useSessionStore } from "@/zustand/sessionStore";
import axios from "axios";
import { useCallback, useEffect, useReducer, useState } from "react";
import { DataReducer } from "../reducers/DataReducer";

export type ProjectData = {
	project: ProjectType;
	aggregates: ProjectAggregatesType;
	metaData: AnalyticsMetaType[];
};

type useDataCallbacks = {
	onSync?: () => void;
	onError?: (message: string) => void;
};

export const useData = (callbacks?: useDataCallbacks) => {
	// zustand's global context
	const isLoggedIn = useSessionStore((state) => state.isLoggedIn);

	// internal states
	const [data, dispatch] = useReducer(DataReducer, null);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
		null,
	);

	// user functions
	const sync = useCallback(async () => {
		try {
			const projectListData = (await axios.get("/api/analytics/user/projects"))
				.data as ProjectType[];

			const finalData = await Promise.all(
				projectListData.map(async (project) => {
					const projectData = (
						await axios.get(`api/analytics/user/project/${project.id}`)
					).data as ProjectDataType;

					return {
						project,
						aggregates: projectData.aggregates,
						metaData: projectData.metaData,
					};
				}),
			);

			dispatch({ type: "SET_DATA", data: finalData });
            console.log(finalData);
			callbacks?.onSync?.();
			return finalData;
		} catch (e) {
			const error = e instanceof Error ? e.message : "unknown error";
			callbacks?.onError?.(error);
			return error;
		}
	}, [callbacks]);

	// re-sync on log in
	useEffect(() => {
		if (isLoggedIn === false && data !== null) {
			dispatch({ type: "SET_DATA", data: null });
			return;
		}

		if (isLoggedIn !== false && data === null) {
			sync();
		}
	}, [isLoggedIn, sync, data]);

	return {
		data,
		dispatch,
		sync,
		selectedProjectId,
		setSelectedProjectId,
	};
};

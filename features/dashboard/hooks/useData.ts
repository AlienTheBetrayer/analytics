import type {
	AnalyticsMetaType,
	ProjectAggregatesType,
	ProjectDataType,
	ProjectType,
} from "@/app/types/database";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDashboardContext } from "../context/DashboardContext";

export type ProjectData = {
	project: ProjectType;
	aggregates: ProjectAggregatesType;
	metaData: AnalyticsMetaType[];
};

type SyncResponse = {
	status: "ok" | "error";
	data?: ProjectData[];
	message?: string;
};

type useDataCallbacks = {
	onSync?: () => void;
	onError?: (message: string) => void;
};

export const useData = (callbacks?: useDataCallbacks) => {
	// context
	const [state, dispatch] = useDashboardContext();

	// states
	const [data, setData] = useState<ProjectData[] | null>(null);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
		null,
	);

	// refs
	const isSyncing = useRef<boolean>(false);
	const hasInitiallySynced = useRef<boolean>(false);

	// api function
	const sync = useCallback(async (): Promise<SyncResponse> => {
		if (state.isVisible === false) {
			return { status: "error" };
		}

		try {
			const projectListRes = await axios.get("api/analytics?type=projects");

			const projectListData = projectListRes.data as ProjectType[];

			const finalData = projectListData.map(async (project) => {
				const specificRes = await axios.get(
					`api/analytics?type=project&id=${project.id}`,
				);
				const specificData = specificRes.data as ProjectDataType;

				return {
					project,
					aggregates: specificData.aggregates,
					metaData: specificData.metaData,
				};
			});

			const returnData = await Promise.all(finalData);
			return { status: "ok", data: returnData };
		} catch (e) {
			const error = e instanceof Error ? e.message : "unknown error";
			return { status: "error", message: error };
		}
	}, [state]);

	// user functions
	const resync = useCallback(async () => {
		if (isSyncing.current !== true) {
			isSyncing.current = true;
			setData(null);
			dispatch({ type: "SET_IS_SYNCING", flag: true });

			sync().then((res) => {
				switch (res.status) {
					case "ok":
						setData(res.data ?? null);
						isSyncing.current = false;
						dispatch({ type: "SET_IS_SYNCING", flag: false });
                        callbacks?.onSync?.();
						break;
					case "error":
						callbacks?.onError?.(res.message ?? "unknown error");
						break;
				}
			});
		}
	}, [sync, dispatch, callbacks]);

	// initial sync + auto-sync
	useEffect(() => {
		if (hasInitiallySynced.current === false) {
			resync();
			hasInitiallySynced.current = true;
		}
	}, [resync]);

	return {
		data,
		sync,
		resync,
		isSyncing,
		selectedProjectId,
		setSelectedProjectId,
	};
};

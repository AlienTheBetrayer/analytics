import type {
	AnalyticsMetaType,
	ProjectAggregatesType,
	ProjectDataType,
	ProjectType,
} from "@/app/types/database";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

export type ProjectData = {
	project: ProjectType;
	aggregates: ProjectAggregatesType;
	metaData: AnalyticsMetaType[];
};

export const useSync = () => {
	// states
	const [data, setData] = useState<ProjectData[] | null>(null);
	const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(false);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

	// refs
	const isSyncing = useRef<boolean>(false);

	// api function
	const sync = useCallback(async () => {
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

		Promise.all(finalData).then((d) => setData(d));
	}, []);

	// initial sync + auto-sync
	useEffect(() => {
		sync();

		if (autoSyncEnabled) {
			const interval = setInterval(sync, 1000);
			return () => clearInterval(interval);
		}
	}, [sync, autoSyncEnabled]);

	// user API
	const resync = useCallback(async () => {
		isSyncing.current = true;
		setData(null);
        setSelectedProjectId(null);
		await sync();
		isSyncing.current = false;
	}, [sync]);

	return {
		data,
		sync,
		resync,
		isSyncing,
		selectedProjectId,
		setSelectedProjectId,
		autoSyncEnabled,
		setAutoSyncEnabled,
	};
};

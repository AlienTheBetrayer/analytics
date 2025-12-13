import type { ProjectType } from "@/app/types/database";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

export type DataType = {
	projects: ProjectType[];
} | null;

export const useSync = () => {
	// states
	const [data, setData] = useState<DataType>(null);
	const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(false);

	// refs
	const isSyncing = useRef<boolean>(false);

	// api function
	const sync = useCallback(async () => {
		const res = await axios.get("api/analytics?type=projects");
		setData({ projects: res.data });
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
		await sync();
		isSyncing.current = false;
	}, [sync]);

	return {
		data,
		sync,
		resync,
		isSyncing,
		autoSyncEnabled,
		setAutoSyncEnabled,
	};
};

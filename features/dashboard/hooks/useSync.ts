import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const useSync = () => {
	// states
	const [data, setData] = useState<object | null>(null);
	const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(false);

	const sync = useCallback(async () => {
		const res = await axios.get("api/analytics");
		return res.data;
	}, []);

	useEffect(() => {
		const syncData = () => {
			sync().then((res) => setData(res));
		};
		syncData();

		if (autoSyncEnabled) {
			const interval = setInterval(syncData, 1000);
			return () => clearInterval(interval);
		}
	}, [sync, autoSyncEnabled]);

	return {
		data,
		sync,
		autoSyncEnabled,
		setAutoSyncEnabled,
	};
};

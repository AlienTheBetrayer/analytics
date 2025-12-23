import { useCallback, useState } from "react";

export type PromiseStatus = "idle" | "pending" | "resolved" | "rejected";

export type PromiseStatuses = Record<string, PromiseStatus>;

export const usePromiseStatus = () => {
	const [statuses, setStatuses] = useState<PromiseStatuses>({});

	const wrap = useCallback(
		async <T>(key: string, promiseCallback: () => Promise<T>) => {
			setStatuses((prev) => ({ ...prev, [key]: "pending" }));

			try {
				const res = await promiseCallback();
				setStatuses((prev) => ({ ...prev, [key]: "resolved" }));
				return res;
			} catch (err) {
				setStatuses((prev) => ({ ...prev, [key]: "rejected" }));
				throw err;
			}
		},
		[],
	);

	const get = useCallback(
		(key: string) => {
			return statuses[key] || "idle";
		},
		[statuses],
	);

	return {
		wrap,
		get,
	};
};

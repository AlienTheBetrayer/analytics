"use client";
import { useEffect, useRef } from "react";
import { useAppStore } from "./store";

/**
 * A pure component that handles the initial data loading / state management.
 */
export const StoreInitialHandler = () => {
	// zustand
	const refresh = useAppStore((state) => state.refresh);

	// ref
	const hasInitialized = useRef<boolean>(false);

	useEffect(() => {
		if (hasInitialized.current === false) {
			refresh().catch(() => {});
			hasInitialized.current = true;
		}
	}, [refresh]);

	return null;
};

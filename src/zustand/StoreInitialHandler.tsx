"use client";
import { useEffect, useRef } from "react";
import { useAppStore } from "./store";

/**
 * A pure component that handles the initial data loading / state management.
 */
export const StoreInitialHandler = () => {
	// zustand states
	const status = useAppStore((state) => state.status);
	const getFriendsProfiles = useAppStore((state) => state.getFriendsProfiles);

	// zustand functions
	const refresh = useAppStore((state) => state.refresh);
	const getProfileById = useAppStore((state) => state.getProfileById);

	// ref
	const hasInitialized = useRef<boolean>(false);

	useEffect(() => {
		if (hasInitialized.current === false) {
			refresh();
			hasInitialized.current = true;
		}
	}, [refresh]);

	useEffect(() => {
		if (status) {
			getProfileById(status.user.id);
			getFriendsProfiles();
		}
	}, [status, getProfileById, getFriendsProfiles]);

	return null;
};

import { useEffect } from "react";
import { useAppStore } from "@/zustand/store";

/**
 * acts as a wrapper around zustand's data loading system
 */
export const useData = () => {
	// zustand state
	const selectedProjectId = useAppStore((state) => state.selectedProjectId);
	const status = useAppStore((state) => state.status);

	// zustand functions
	const updateProjectList = useAppStore((state) => state.updateProjectList);
	const updateProjectData = useAppStore((state) => state.updateProjectData);
	const emptyData = useAppStore((state) => state.emptyData);
	const deselectProject = useAppStore((state) => state.deselectProject);

	// fetching initial data if we're logged in and clearing everything if we log out
	useEffect(() => {
		if (status?.isLoggedIn !== true) {
			emptyData();
			deselectProject();
			return;
		}

		updateProjectList(true);
	}, [updateProjectList, emptyData, status, deselectProject]);

	// every single time we change the project id, we fetch new data
	useEffect(() => {
		if (selectedProjectId === null) return;

		updateProjectData(selectedProjectId, true);
	}, [selectedProjectId, updateProjectData]);
};

import { useEffect } from "react";
import { useAppStore } from "@/zustand/store";

/**
 * acts as a wrapper around zustand's data loading system
 */
export const useData = () => {
    // zustand state
    const status = useAppStore((state) => state.status);

    // zustand functions
    const emptyData = useAppStore((state) => state.emptyData);
    const deselectProject = useAppStore((state) => state.deselectProject);
    const syncData = useAppStore((state) => state.syncData);

    // fetching initial data if we're logged in and clearing everything if we log out
    useEffect(() => {
        if (!status) {
            emptyData();
            deselectProject();
        } else {
            syncData();
        }
    }, [emptyData, status, deselectProject, syncData]);
};

import { useEffect } from "react";
import { useAppStore } from "@/zustand/store";

/**
 * acts as a wrapper around zustand's data loading system
 */
export const useData = () => {
    // zustand state
    const status = useAppStore((state) => state.status);

    // zustand functions
    const deleteState = useAppStore((state) => state.deleteState);
    const selectProject = useAppStore((state) => state.selectProject);
    const sync = useAppStore((state) => state.sync);

    // fetching initial data if we're logged in and clearing everything when we log out
    useEffect(() => {
        if (!status) {
            deleteState();
            selectProject(undefined);
        } else {
            sync();
        }
    }, [status, deleteState, selectProject, sync]);
};

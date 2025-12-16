import type { DashboardType } from "../context/DashboardContext";

export type DashboardAction =
	// ui states
	| { type: "SET_IS_VISIBLE"; flag: boolean }
	| { type: "SET_IS_SYNCING"; flag: boolean };
    
export const DashboardReducer = (
	state: DashboardType,
	action: DashboardAction,
): DashboardType => {
	switch (action.type) {
		case "SET_IS_VISIBLE":
			return { ...state, isVisible: action.flag };
		case "SET_IS_SYNCING":
			return { ...state, isSyncing: action.flag };
	}
};

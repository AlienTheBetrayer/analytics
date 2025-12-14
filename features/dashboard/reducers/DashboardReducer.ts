import type { DashboardType } from "../context/DashboardContext";

export type DashboardAction =
	| { type: "SET_VISIBLE"; flag: boolean }
	| { type: "SET_PROGRESS"; progress: number | null };

export const DashboardReducer = (
	state: DashboardType,
	action: DashboardAction,
): DashboardType => {
	switch (action.type) {
		case "SET_VISIBLE":
			return { ...state, visible: action.flag };
		case "SET_PROGRESS":
			return { ...state, syncingProgress: action.progress };
	}
};

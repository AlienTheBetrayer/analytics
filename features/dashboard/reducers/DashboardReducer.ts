import type { DashboardType } from "../context/DashboardContext";

export type DashboardAction = { type: "SET_VISIBLE"; flag: boolean };

export const DashboardReducer = (
	state: DashboardType,
	action: DashboardAction,
): DashboardType => {
	switch (action.type) {
		case "SET_VISIBLE":
			return { ...state, visible: action.flag };
	}
};

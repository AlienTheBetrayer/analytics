import type { DashboardType } from "../context/DashboardContext";

export type DashboardAction =
	// ui states
	| { type: "SET_IS_VISIBLE"; flag: boolean }
	| { type: "AUTH_FORM_SET"; flag: DashboardType["authForm"] };

export const DashboardReducer = (
	state: DashboardType,
	action: DashboardAction,
): DashboardType => {
	switch (action.type) {
		case "SET_IS_VISIBLE":
			return { ...state, isVisible: action.flag };
		case "AUTH_FORM_SET":
			return { ...state, authForm: action.flag };
	}
};

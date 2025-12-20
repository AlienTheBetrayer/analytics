import { createContext, useContext, useReducer } from "react";
import {
	type DashboardAction,
	DashboardReducer,
} from "../reducers/DashboardReducer";

export type DashboardType = {
	isVisible: boolean;
	isSyncing: boolean;
    authForm: 'register' | 'login' | 'logout' | null;
};

export type DashboardContextType = [
	DashboardType,
	React.Dispatch<DashboardAction>,
];

export const DashboardContext = createContext<DashboardContextType | null>(
	null,
);

type Props = {
	children?: React.ReactNode;
};

export const DashboardProvider = ({ children }: Props) => {
	const [state, dispatch] = useReducer(DashboardReducer, {
		isVisible: true,
		isSyncing: false,
        authForm: null,
	});

	return (
		<DashboardContext.Provider value={[state, dispatch]}>
			{children}
		</DashboardContext.Provider>
	);
};

export const useDashboardContext = () => {
	const ctx = useContext(DashboardContext);
	if (!ctx) throw new Error("useDashboardContext() is used incorrectly.");
	return ctx;
};

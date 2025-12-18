import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SessionStoreType = {
	isLoggedIn: boolean;

	setIsLoggedIn: (flag: boolean) => void;
};

export const useSessionStore = create<SessionStoreType>()(
	persist(
		(set) => ({
			isLoggedIn: false,
			setIsLoggedIn: (flag: boolean) => {
				set((state) => ({ ...state, isLoggedIn: flag }));
			},
		}),
		{
			name: "app-storage",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);

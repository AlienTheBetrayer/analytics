import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type LocalStoreType = {
	isLoggedIn: boolean;

	setIsLoggedIn: (flag: boolean) => void;
};

export const useLocalStore = create<LocalStoreType>()(
	persist(
		(set) => ({
			isLoggedIn: false,
			setIsLoggedIn: (flag: boolean) => {
				set((state) => ({ ...state, isLoggedIn: flag }));
			},
		}),
		{
			name: "app-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

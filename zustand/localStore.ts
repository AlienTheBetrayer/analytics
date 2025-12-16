import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type LocalStoreType = {
	loggedIn: boolean;

	setLoggedIn: (flag: boolean) => void;
};

export const useLocalStore = create<LocalStoreType>()(
	persist(
		(set) => ({
			loggedIn: false,
			setLoggedIn: (flag: boolean) => {
				set((state) => ({ ...state, loggedIn: flag }));
			},
		}),
		{
			name: "app-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

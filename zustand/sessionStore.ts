import type { LoginData } from "@/types/loginData";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SessionStoreType = {
	isLoggedIn: LoginData;

	setIsLoggedIn: (flag: LoginData) => void;
};

export const useSessionStore = create<SessionStoreType>()(
	persist(
		(set) => ({
			isLoggedIn: false,
			setIsLoggedIn: (flag: LoginData) => {
				set((state) => ({ ...state, isLoggedIn: flag }));
			},
		}),
		{
			name: "app-storage",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);

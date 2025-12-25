import { create } from "zustand";
import type { ProfileStore } from "@/types/zustand/profile";
import type { AuthenticationStore } from "../types/zustand/authentication";
import type { DashboardStore } from "../types/zustand/dashboard";
import type { DataStore } from "../types/zustand/data";
import { AuthenticationSlice } from "./slices/authentication";
import { DashboardSlice } from "./slices/dashboard";
import { DataSlice } from "./slices/data";
import { ProfileSlice } from "./slices/profile";

export type StoreType = AuthenticationStore &
	DashboardStore &
	DataStore &
	ProfileStore;

export const useAppStore = create<StoreType>((set, get) => ({
	...AuthenticationSlice(set, get),
	...DashboardSlice(set, get),
	...DataSlice(set, get),
	...ProfileSlice(set, get),
}));

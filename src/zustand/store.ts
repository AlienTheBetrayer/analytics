"use client";
import { create } from "zustand";
import type { UserStore } from "@/types/zustand/user";
import type { AuthenticationStore } from "../types/zustand/authentication";
import type { DashboardStore } from "../types/zustand/dashboard";
import type { DataStore } from "../types/zustand/data";
import { AuthenticationSlice } from "./slices/authentication";
import { DashboardSlice } from "./slices/dashboard";
import { DataSlice } from "./slices/data";
import { UserSlice } from "./slices/user";
import { NotificationStore } from "@/types/zustand/notification";
import { NotificationSlice } from "./slices/notification";

export type StoreType = AuthenticationStore &
    DashboardStore &
    DataStore &
    UserStore &
    NotificationStore;

export const useAppStore = create<StoreType>((set, get) => ({
    ...AuthenticationSlice(set, get),
    ...DashboardSlice(set, get),
    ...DataSlice(set, get),
    ...UserSlice(set, get),
    ...NotificationSlice(set, get),
}));

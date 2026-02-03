"use client";
import { create } from "zustand";
import type { DashboardStore } from "../types/zustand/dashboard";
import { DashboardSlice } from "./slices/dashboard";
import { NotificationStore } from "@/types/zustand/notification";
import { NotificationSlice } from "./slices/notification";
import { PostStore } from "@/types/zustand/posts";
import { PostSlice } from "@/zustand/slices/posts";

export type StoreType = DashboardStore & NotificationStore & PostStore;

export const useAppStore = create<StoreType>((set, get) => ({
    ...DashboardSlice(set, get),
    ...NotificationSlice(set, get),
    ...PostSlice(set, get),
}));

"use client";
import { create } from "zustand";
import type { DashboardStore } from "../types/zustand/dashboard";
import { DashboardSlice } from "./slices/dashboard";
import { NotificationStore } from "@/types/zustand/notification";
import { NotificationSlice } from "./slices/notification";
import { PostStore } from "@/types/zustand/posts";
import { PostSlice } from "@/zustand/slices/posts";
import { MessagesStore } from "@/types/zustand/messages";
import { MessagesSlice } from "@/zustand/slices/messages";

export type StoreType = DashboardStore &
    NotificationStore &
    PostStore &
    MessagesStore;

export const useAppStore = create<StoreType>((set, get) => ({
    ...DashboardSlice(set, get),
    ...NotificationSlice(set, get),
    ...PostSlice(set, get),
    ...MessagesSlice(set, get),
}));

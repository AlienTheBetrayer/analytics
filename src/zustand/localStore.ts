"use client";
import { LocalStore } from "@/types/zustand/local";
import { create } from "zustand";
import { LocalSlice } from "./slices/local";
import { persist } from "zustand/middleware";

export const useLocalStore = create<LocalStore>()(
    persist(
        (set, get) => ({
            ...LocalSlice(set, get),
        }),
        {
            name: "local-store",
        }
    )
);

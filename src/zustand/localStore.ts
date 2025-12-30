"use client";
import { UIStore } from "@/types/zustand/local/ui";
import { create } from "zustand";
import { UISlice } from "./slices/local/ui";
import { persist } from "zustand/middleware";

export type LocalStoreType = UIStore;

export const useLocalStore = create<LocalStoreType>()(
    persist(
        (set, get) => ({
            ...UISlice(set, get),
        }),
        {
            name: "local-store",
        },
    ),
);

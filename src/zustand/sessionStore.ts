"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SessionSlice } from "@/zustand/slices/session";
import { SessionStore } from "@/types/zustand/session";

export const useSessionStore = create<SessionStore>()(
    persist(
        (set, get) => ({
            ...SessionSlice(set, get),
        }),
        {
            name: "session-store",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);

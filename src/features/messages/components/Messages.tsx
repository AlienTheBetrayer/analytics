"use client";

import { Select } from "@/features/messages/components/Select";
import { Topline } from "@/features/messages/components/Topline";
import { useAppStore } from "@/zustand/store";

export const Messages = () => {
    const isMaximized = useAppStore((state) => state.display.maximized);

    return (
        <>
            <Topline />

            <div
                className={`box w-full max-w-400 min-h-164 p-4! mx-auto
                ${isMaximized ? "fixed! inset-0 z-4 max-w-screen" : ""}`}
            >
                <Select />
            </div>
        </>
    );
};

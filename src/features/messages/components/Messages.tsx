"use client";

import { Select } from "@/features/messages/components/Select";
import { Topline } from "@/features/messages/components/Topline";
import { useAppStore } from "@/zustand/store";
import { motion } from "motion/react";

export const Messages = () => {
    const isMaximized = useAppStore((state) => state.display.maximized);

    return (
        <>
            <Topline />

            <motion.div
                layout
                className={`box w-full max-w-400 min-h-164 p-4! mx-auto
                ${isMaximized ? "fixed! inset-0 z-4 max-w-screen" : ""}`}
                transition={{ type: "spring", bounce: 0 }}
            >
                <Select />
            </motion.div>
        </>
    );
};

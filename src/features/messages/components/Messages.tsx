"use client";

import { Select } from "@/features/messages/components/Select";
import { Topline } from "@/features/messages/components/Topline";

export const Messages = () => {
    return (
        <>
            <Topline />

            <div className="box w-full max-w-400 min-h-150 p-4!">
                <Select />
            </div>
        </>
    );
};

"use client";
import { useAppStore } from "@/zustand/store";
import { Select } from "./view/Select";
import { Topline } from "./view/Topline";
import { AuthRequired } from "@/features/authentication/components/AuthRequired";

export const Notifications = () => {
    // zustand
    const status = useAppStore((state) => state.status);

    if (!status) {
        return (
            <div className="box w-full max-w-7xl mx-auto min-h-128">
                <AuthRequired />
            </div>
        );
    }

    return (
        <>
            <Topline />
            <div className="box w-full max-w-7xl mx-auto min-h-128">
                <Select />
            </div>
        </>
    );
};

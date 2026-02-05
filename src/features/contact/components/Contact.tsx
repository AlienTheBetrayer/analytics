"use client";
import { Select } from "@/features/contact/components/Select";
import { Topline } from "@/features/contact/components/Topline";

export const Contact = () => {
    return (
        <>
            <Topline />

            <div className="box w-full max-w-400 mx-auto min-h-128">
                <Select />
            </div>
        </>
    );
};

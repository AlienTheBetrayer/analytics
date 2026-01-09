"use client";

import { Topline } from "./view/Topline";
import { Select } from "./view/Select";

export const Notifications = () => {
    return (
        <>
            <Topline />
            <div className="box w-full max-w-7xl mx-auto min-h-128">
                <Select />
            </div>
        </>
    );
};

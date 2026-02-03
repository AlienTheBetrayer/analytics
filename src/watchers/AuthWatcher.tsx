"use client";
import { useQuery } from "@/query/core";

export const AuthWatcher = () => {
    // authentication status
    useQuery({ key: ["status"] });

    return null;
};

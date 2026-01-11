"use client";
import { useEffect } from "react";
import { useLocalStore } from "./localStore";
import { DashboardNotification } from "@/types/zustand/local";

export const LocalStoreWatcher = () => {
    // zustand
    const addNotificationListener = useLocalStore(
        (state) => state.addNotificationListener
    );

    const removeNotificationListener = useLocalStore(
        (state) => state.removeNotificationListener
    );

    // attaching listeners
    useEffect(() => {
        const handle = (notification: DashboardNotification) => {
        };

        addNotificationListener({ callback: handle });

        return () => removeNotificationListener({ callback: handle });
    }, [addNotificationListener, removeNotificationListener]);

    return null;
};

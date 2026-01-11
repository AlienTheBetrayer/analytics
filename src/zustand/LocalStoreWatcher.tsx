"use client";
import { useEffect } from "react";
import { useAppStore } from "./store";
import { useLocalStore } from "./localStore";
import { DashboardNotificationPartial } from "@/types/zustand/local";

export const LocalStoreWatcher = () => {
    //  store
    const addListener = useAppStore((state) => state.addListener);
    const removeListener = useAppStore((state) => state.removeListener);

    // localstore
    const pushNotification = useLocalStore((state) => state.pushNotification);

    // attaching listeners
    useEffect(() => {
        const handle = (notification: DashboardNotificationPartial) => {
            pushNotification({ ...notification });
        };

        addListener({ callback: handle });

        return () => {
            removeListener({ callback: handle });
        };
    }, [addListener, removeListener, pushNotification]);

    return null;
};

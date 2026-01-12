"use client";
import { useEffect, useState } from "react";
import { useAppStore } from "./store";
import { useLocalStore } from "./localStore";
import { NotificationPartial } from "@/types/zustand/local";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import { NotificationPopup } from "@/features/notifications/components/popup/NotificationPopup";

export const LocalStoreWatcher = () => {
    //  store
    const addListener = useAppStore((state) => state.addListener);
    const removeListener = useAppStore((state) => state.removeListener);

    // localstore
    const pushNotification = useLocalStore((state) => state.pushNotification);

    // popup states
    const [mounted, setMounted] = useState<boolean>(false);
    const [notification, setNotification] = useState<
        NotificationPartial | undefined
    >(undefined);

    // attaching listeners
    useEffect(() => {
        requestAnimationFrame(() => {
            setMounted(true);
        });

        const handle = (notification: NotificationPartial) => {
            pushNotification({ ...notification });
            setNotification(notification);
        };

        addListener({ callback: handle });

        return () => {
            removeListener({ callback: handle });
        };
    }, [addListener, removeListener, pushNotification]);

    useEffect(() => {
        if (!notification) {
            return;
        }

        setTimeout(() => setNotification(undefined), 10000);
    }, [notification]);

    return (
        mounted &&
        createPortal(
            <AnimatePresence>
                {notification && (
                    <NotificationPopup
                        notification={notification}
                        onInteract={() => setNotification(undefined)}
                    />
                )}
            </AnimatePresence>,
            document.body
        )
    );
};

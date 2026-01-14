"use client";
import { useEffect, useState } from "react";
import { useAppStore } from "./store";
import { useLocalStore } from "./localStore";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import { NotificationPopup } from "@/features/notifications/components/popup/NotificationPopup";
import { NotificationPartial } from "@/types/other/notifications";

export const LocalStoreWatcher = () => {
    //  store
    const addListener = useAppStore((state) => state.addListener);
    const removeListener = useAppStore((state) => state.removeListener);
    const status = useAppStore((state) => state.status);

    // localstore
    const pushNotification = useAppStore((state) => state.pushNotification);
    const preferences = useLocalStore((state) => state.preferences);
    const theme = useLocalStore((state) => state.theme);

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

        if (status) {
            const handle = (notification: NotificationPartial) => {
                pushNotification({ ...notification });

                if (preferences.visibility) {
                    setNotification(notification);
                }
            };

            addListener({ callback: handle });

            return () => {
                removeListener({ callback: handle });
            };
        }
    }, [addListener, removeListener, pushNotification, preferences, status]);

    useEffect(() => {
        if (!notification) {
            return;
        }

        setTimeout(() => setNotification(undefined), 7500);
    }, [notification]);

    useEffect(() => {
        if (!mounted) {
            return;
        }

        document.documentElement.setAttribute("data-theme", theme);
    }, [mounted, theme]);

    return (
        mounted &&
        status &&
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

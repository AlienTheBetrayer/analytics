"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import { NotificationPopup } from "@/features/notifications/components/popup/NotificationPopup";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";
import { notificationListeners } from "@/notifications/data/init";
import { NotificationData } from "@/types/other/notifications";

export const LocalStoreWatcher = () => {
    // localstore
    const pushNotification = useAppStore((state) => state.pushNotification);
    const preferences = useLocalStore((state) => state.preferences);
    const theme = useLocalStore((state) => state.theme);

    // popup states
    const [mounted, setMounted] = useState<boolean>(false);
    const [notification, setNotification] = useState<NotificationData | null>(
        null,
    );

    // notification
    useEffect(() => {
        const handle = (notification: NotificationData) => {
            pushNotification(notification);
            if (preferences.visibility) {
                setNotification(notification);
            }
        };

        notificationListeners.attach({ key: "all", fn: handle });
        return () => notificationListeners.detach({ key: "all", fn: handle });
    }, [pushNotification, preferences]);

    // notification clearing
    useEffect(() => {
        const timeout = setTimeout(() => setNotification(null), 6000);
        return () => clearTimeout(timeout);
    }, [notification]);

    // theme
    useEffect(() => {
        requestAnimationFrame(() => {
            setMounted(true);
        });
        if (!mounted) {
            return;
        }

        document.documentElement.setAttribute("data-theme", theme);
    }, [mounted, theme]);

    // notification popup
    return (
        mounted &&
        createPortal(
            <AnimatePresence>
                {notification && (
                    <NotificationPopup
                        notification={notification}
                        onInteract={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>,
            document.body,
        )
    );
};

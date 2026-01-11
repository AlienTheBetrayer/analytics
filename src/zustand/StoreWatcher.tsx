"use client";
import { useEffect } from "react";
import { useAppStore } from "./store";
import { useLocalStore } from "./localStore";
import { AuthenticationToken } from "@/types/auth/authentication";

/**
 * A pure component that handles the initial data loading / state management.
 */
export const StoreWatcher = () => {
    // zustand functions
    const getSessions = useAppStore((state) => state.getSessions);
    const getUsers = useAppStore((state) => state.getUsers);
    const setVisibleProfile = useLocalStore((state) => state.setVisibleProfile);

    // authenticating session
    useEffect(() => {
        getSessions({ type: "current" })
            .then((token) => {
                if (!token || !("role" in token)) {
                    return;
                }
                const authToken = token as AuthenticationToken;

                getUsers({
                    select: ["profile", "friend_requests", "friends"],
                    id: [authToken.id],
                    caching: false,
                }).then((user) => {
                    if (!user?.length) {
                        return;
                    }
                    setVisibleProfile({
                        username: user[0].username,
                        avatar_url: user[0].profile?.avatar_url,
                        color: user[0].profile?.color,
                    });
                });
            })
            .catch(() => {
                setVisibleProfile(undefined);
            });
    }, [getUsers, getSessions, setVisibleProfile]);

    return null;
};

"use client";
import { useEffect, useRef } from "react";
import { useAppStore } from "./store";

/**
 * A pure component that handles the initial data loading / state management.
 */
export const StoreInitialHandler = () => {
    // zustand states
    const status = useAppStore((state) => state.status);
    const friendRequests = useAppStore((state) => state.friendRequests);

    // zustand functions
    const refresh = useAppStore((state) => state.refresh);
    const getProfileById = useAppStore((state) => state.getProfileById);
    const getFriendsProfiles = useAppStore((state) => state.getFriendsProfiles);
    const getFriendRequests = useAppStore((state) => state.getFriendRequests);
    const getProfiles = useAppStore((state) => state.getProfiles);

    // ref
    const hasInitialized = useRef<boolean>(false);

    useEffect(() => {
        if (hasInitialized.current === false) {
            try {
                refresh();
            } catch {}
            hasInitialized.current = true;
        }
    }, [refresh]);

    useEffect(() => {
        if (status) {
            getProfileById(status.user.id, false);
            getFriendsProfiles(status.user.id, false);
            getFriendRequests(status.user.id, false);
        }
    }, [getFriendsProfiles, getFriendRequests, getProfileById, status]);

    useEffect(() => {
        if (
            status &&
            friendRequests &&
            (friendRequests.incoming.length > 0 || friendRequests.outcoming.length > 0)
        ) {
            getProfiles(friendRequests.incoming, false);
            getProfiles(friendRequests.outcoming, false);
        }
    }, [getProfiles, friendRequests, status]);

    return null;
};

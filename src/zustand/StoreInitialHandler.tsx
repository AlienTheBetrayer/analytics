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
    const getProfileById = useAppStore((state) => state.getProfileById);
    const getFriendsProfiles = useAppStore((state) => state.getFriendsProfiles);
    const getFriendRequests = useAppStore((state) => state.getFriendRequests);
    const getProfiles = useAppStore((state) => state.getProfiles);
    const getSession = useAppStore((state) => state.getSession);

    // ref
    const hasInitialized = useRef<boolean>(false);

    useEffect(() => {
        if (hasInitialized.current === false) {
            try {
                getSession();
            } catch {}
            hasInitialized.current = true;
        }
    }, [getSession]);

    useEffect(() => {
        if (status) {
            getProfileById(status.id, false);
            getFriendsProfiles(status.id, false);
            getFriendRequests(status.id, false);
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

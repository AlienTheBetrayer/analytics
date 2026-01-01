"use client";
import { useEffect, useRef } from "react";
import { useAppStore } from "./store";
import { useLocalStore } from "./localStore";
import { Profile } from "@/types/api/database/profiles";
import { User } from "@/types/api/database/user";

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

    // zustand local store
    const setVisibleProfile = useLocalStore((state) => state.setVisibleProfile);

    // ref
    const hasInitialized = useRef<boolean>(false);

    // authenticating session
    useEffect(() => {
        if (hasInitialized.current === false) {
            getSession().catch(() => {
                setVisibleProfile(undefined);
            });
            hasInitialized.current = true;
        }
    }, [getSession, setVisibleProfile]);

    // getting our profile
    useEffect(() => {
        if (status) {
            getProfileById(status.id, false)
                .then((res) => {
                    const data = res?.data as { profile: Profile; user: User };

                    if (!data) {
                        return;
                    }

                    setVisibleProfile({
                        username: data.user.username,
                        avatar: data.profile.avatar,
                        color: data.profile.color,
                    });
                })
                .catch(() => {
                    setVisibleProfile(undefined);
                });

            getFriendsProfiles(status.id, false);
            getFriendRequests(status.id, false);
        }
    }, [
        getFriendsProfiles,
        getFriendRequests,
        getProfileById,
        setVisibleProfile,
        status,
    ]);

    // getting friend request's profiles
    useEffect(() => {
        if (
            status &&
            friendRequests &&
            (friendRequests.incoming.length > 0 ||
                friendRequests.outcoming.length > 0)
        ) {
            getProfiles(friendRequests.incoming, false);
            getProfiles(friendRequests.outcoming, false);
        }
    }, [getProfiles, friendRequests, status]);

    return null;
};

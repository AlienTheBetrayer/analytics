"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/zustand/store";
import { Content } from "./display/Content";
import { Topline } from "./display/Topline";
import { LoadingProfile } from "@/features/loading/components/LoadingProfile";
import { AbsentTopline } from "@/features/loading/components/AbsentTopline";

export const UserProfile = () => {
    // url
    const { name } = useParams<{
        name: string | undefined;
    }>();

    // zustand state
    const status = useAppStore((state) => state.status);
    const users = useAppStore((state) => state.users);
    const profiles = useAppStore((state) => state.profiles);

    // zustand functions
    const getUsers = useAppStore((state) => state.getUsers);

    // user data
    const retrievedUsername = name ?? status?.username;

    // fetch if haven't cached
    useEffect(() => {
        if (!retrievedUsername) {
            return;
        }

        getUsers({
            username: [retrievedUsername],
            select: ["profile", "friend_requests", "friends", "colors"],
        });
    }, [retrievedUsername, getUsers]);

    const user = Object.values(users).find(
        (u) => u.username === retrievedUsername,
    );

    // wrong username
    if (!retrievedUsername) {
        return (
            <>
                <AbsentTopline title="Incorrect username" />

                <div
                    className={`box max-w-400 mt-2 w-full m-auto min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingProfile />
                </div>
            </>
        );
    }

    // no user found in db
    if (!user) {
        return (
            <>
                <AbsentTopline title="User does not exist" />

                <div
                    className={`box max-w-400 mt-2 w-full m-auto min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingProfile />
                </div>
            </>
        );
    }

    const retrievedData = { user, profile: profiles[user.id] };

    return (
        <>
            <Topline data={retrievedData} />

            <div
                className={`box max-w-400 w-full m-auto rounded-4xl! min-h-128 overflow-hidden`}
            >
                <Content data={retrievedData} />
            </div>
        </>
    );
};

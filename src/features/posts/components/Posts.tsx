"use client";
import { AbsentTopline } from "@/features/loading/components/AbsentTopline";
import { LoadingProfile } from "@/features/loading/components/LoadingProfile";
import { Select } from "@/features/posts/components/Select";
import { Topline } from "@/features/posts/components/Topline";
import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export const Posts = () => {
    // url
    const { username } = useParams<{ id?: string; username?: string }>();

    // zustand
    const status = useAppStore((state) => state.status);
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);
    const postIds = useAppStore((state) => state.postIds);
    const getPosts = useAppStore((state) => state.getPosts);

    // fetching
    const retrievedUsername = username ?? status?.username;

    const hasFetched = useRef<boolean>(false);
    useEffect(() => {
        if (!retrievedUsername || hasFetched.current) {
            return;
        }

        getPosts({ type: "all", username: retrievedUsername });
        hasFetched.current = true;
    }, [retrievedUsername, getPosts]);

    const user = Object.values(users).find(
        (u) => u.username === retrievedUsername,
    );

    // incorrect url
    if (!user) {
        return (
            <>
                <AbsentTopline title="User does not exist" />

                <div
                    className={`box max-w-400 w-full mx-auto min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingProfile />
                </div>
            </>
        );
    }

    // wrong username
    if (!retrievedUsername) {
        return (
            <>
                <AbsentTopline title="Incorrect username" />

                <div
                    className={`box max-w-400 w-full mx-auto min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingProfile />
                </div>
            </>
        );
    }

    // post does not exist and we're not the user
    if (status?.id !== user?.id && user && !postIds[user?.id]?.length) {
        return (
            <>
                <AbsentTopline title="User hasn't created a post yet" />

                <div
                    className={`box max-w-400 w-full mx-auto min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingProfile />
                </div>
            </>
        );
    }

    const data = { user, profile: profiles[user.id] };

    // main jsx
    return (
        <>
            <Topline
                type="posts"
                data={data}
            />

            <div className="box max-w-400 w-full mx-auto min-h-128 rounded-4xl!">
                <Select
                    type="posts"
                    data={data}
                />
            </div>
        </>
    );
};

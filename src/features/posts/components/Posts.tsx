"use client";
import { AbsentTopline } from "@/features/ui/loading/components/AbsentTopline";
import { LoadingEmulate } from "@/features/ui/loading/components/LoadingEmulate";
import { Select } from "@/features/posts/components/Select";
import { Topline } from "@/features/posts/components/Topline";
import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { useEffect } from "react";

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

    useEffect(() => {
        if (!retrievedUsername) {
            return;
        }

        getPosts({
            type: "all",
            username: retrievedUsername,
            user_id: status?.id,
        });
    }, [retrievedUsername, getPosts, status]);

    const user = Object.values(users).find(
        (u) => u.username === retrievedUsername,
    );

    // fallbacks
    let errorString = "";

    // incorrect url
    if (!user) {
        errorString = "User does not exist";
    }

    // wrong username
    if (!retrievedUsername) {
        errorString = "Incorrect username";
    }

    if (retrievedUsername && !postIds[retrievedUsername]?.size) {
        errorString = "User hasn't created a single post yet";
    }

    if (errorString || !user) {
        return (
            <>
                <AbsentTopline
                    title={errorString}
                    className="max-w-400!"
                />

                <div
                    className={`box max-w-400 w-full mx-auto min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingEmulate />
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

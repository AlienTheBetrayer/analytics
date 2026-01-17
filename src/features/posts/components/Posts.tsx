"use client";
import { AbsentTopline } from "@/features/loading/components/AbsentTopline";
import { LoadingProfile } from "@/features/loading/components/LoadingProfile";
import { Topline } from "@/features/posts/components/Topline";
import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export const Posts = () => {
    // url
    const { username, id } = useParams<{ id?: string; username?: string }>();

    // zustand
    const status = useAppStore((state) => state.status);
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);
    const posts = useAppStore((state) => state.posts);
    const getUsers = useAppStore((state) => state.getUsers);

    // fetching
    const retrievedUsername = username ?? status?.username;

    useEffect(() => {
        if (!retrievedUsername) {
            return;
        }

        getUsers({
            username: [retrievedUsername],
            select: ["profile"], // + "posts"
        });
    }, [retrievedUsername, getUsers]);

    const user = Object.values(users).find(
        (u) => u.username === retrievedUsername,
    );

    // incorrect url
    if (!user) {
        return (
            <>
                <AbsentTopline title="User does not exist" />

                <div
                    className={`box max-w-400 w-full mx-auto p-0! min-h-128 rounded-4xl! overflow-hidden`}
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
                    className={`box max-w-400 w-full mx-auto p-0! min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingProfile />
                </div>
            </>
        );
    }

    // post does not exist and we're not the user
    if (
        status?.role !== "op" &&
        status?.id !== user?.id &&
        user &&
        !posts[user?.id]?.length
    ) {
        return (
            <>
                <AbsentTopline title="User hasn't created a post yet" />

                <div
                    className={`box max-w-400 w-full mx-auto p-0! min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingProfile />
                </div>
            </>
        );
    }

    const retrievedData = { user, profile: profiles[user.id] };

    // main jsx
    return (
        <>
            <Topline data={retrievedData} />

            <div className="box max-w-400 w-full mx-auto min-h-128 rounded-4xl!"></div>
        </>
    );
};

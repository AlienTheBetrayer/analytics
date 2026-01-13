"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthRequired } from "@/features/authentication/components/AuthRequired";
import { useAppStore } from "@/zustand/store";
import { Overview } from "./tabs/overview/Overview";
import { WrongUser } from "./WrongUser";
import { Content } from "./display/Content";
import { Topline } from "./display/Topline";

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

    // user id to fetch data from
    const retrievedUsername = name ?? status?.username;

    const [error, setError] = useState<"no_user" | "no_profile" | undefined>();

    // fetch if haven't cached
    useEffect(() => {
        if (!retrievedUsername) {
            return;
        }

        getUsers({
            username: [retrievedUsername],
            select: ["profile", "friend_requests", "friends", "colors"],
        }).then((data) => {
            if (data && !data?.length) {
                setError("no_user");
                return;
            }
        });
    }, [retrievedUsername, getUsers]);

    // viewing current profile but not logged in
    if (!retrievedUsername) {
        return (
            <div
                className={`box max-w-400 mt-2 w-full m-auto p-0! min-h-120 rounded-3xl! overflow-hidden`}
            >
                <AuthRequired />
            </div>
        );
    }

    const user = Object.values(users).find(
        (u) => u.username === retrievedUsername
    );

    if (
        !user ||
        !profiles[user.id] ||
        error === "no_user" ||
        error === "no_profile"
    ) {
        return (
            <div
                className={`box max-w-400 mt-2 w-full m-auto p-0! min-h-120 rounded-3xl! overflow-hidden`}
            >
                <WrongUser />
            </div>
        );
    }

    const retrievedData = { user, profile: profiles[user.id] };

    if (retrievedData.user.id === status?.id || status?.role === "op") {
        return (
            <>
                <Topline data={retrievedData} />
                <div
                    className={`box max-w-400 w-full m-auto p-0! rounded-3xl! min-h-150 overflow-hidden`}
                >
                    <Content data={retrievedData} />
                </div>
            </>
        );
    }

    return (
        <div
            className={`box max-w-400 w-full m-auto p-0! rounded-3xl! overflow-hidden`}
        >
            <Overview data={retrievedData} />
        </div>
    );
};

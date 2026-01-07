"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthRequired } from "@/features/authentication/components/AuthRequired";
import { useAppStore } from "@/zustand/store";
import { ProfileEdit, ProfileTabs } from "./ProfileEdit";
import { Overview } from "./tabs/Overview";
import { UserLoading } from "./UserLoading";
import { NotFound } from "./NotFound";

export const UserProfile = () => {
    // url
    const { name, tab } = useParams<{
        name: string | undefined;
        tab: string | undefined;
    }>();

    // zustand state
    const status = useAppStore((state) => state.status);
    const users = useAppStore((state) => state.users);
    const profiles = useAppStore((state) => state.profiles);

    // zustand functions
    const getUsers = useAppStore((state) => state.getUsers);

    // user id to fetch data from
    const retrievedUsername = name ?? status?.username;
    const retrievedTab =
        (tab && ProfileTabs.find((t) => t === tab)) || "overview";

    const [error, setError] = useState<"no_user" | "no_profile" | undefined>();

    // fetch if haven't cached
    useEffect(() => {
        if (!retrievedUsername) {
            return;
        }

        getUsers({
            username: [retrievedUsername],
            select: ["profile", "friend_requests", "friends"],
        }).then((data) => {
            if (data && !data?.length) {
                setError("no_user");
                return;
            }
        });
    }, [retrievedUsername, getUsers]);

    // viewing current profile but not logged in
    if (!retrievedUsername) {
        return <AuthRequired description="Log in to see your own profile" />;
    }

    // wrong user
    if (error === "no_user" || error === "no_profile") {
        return <NotFound />;
    }

    const user = Object.values(users).find(
        (u) => u.username === retrievedUsername
    );

    if (!user || !profiles[user.id]) {
        return <UserLoading />;
    }

    const retrievedData = { user, profile: profiles[user.id] };

    return (
        <div
            className={`box max-w-7xl w-full m-auto min-h-160 p-0! rounded-4xl! overflow-hidden`}
            style={{
                outline: `1px solid ${retrievedData.profile?.color ?? "transparent"}`,
            }}
        >
            {retrievedData.user.id === status?.id || status?.role === "op" ? (
                <ProfileEdit
                    data={retrievedData}
                    tab={retrievedTab}
                />
            ) : (
                <Overview data={retrievedData} />
            )}
        </div>
    );
};

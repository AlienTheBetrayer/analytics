"use client";

import { useParams } from "next/navigation";
import { Content } from "./display/Content";
import { Topline } from "./display/Topline";
import { LoadingProfile } from "@/features/ui/loading/components/LoadingProfile";
import { AbsentTopline } from "@/features/ui/loading/components/AbsentTopline";
import { useQuery } from "@/query/core";

export const UserProfile = () => {
    // url
    const { name } = useParams<{
        name: string | undefined;
    }>();

    // fetching
    const { data: status } = useQuery({ key: ["status"] });

    const username = name ?? status?.username;

    // fallbacks
    if (!username) {
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

    return <UserProfileResult username={username} />;
};

type ResultProps = {
    username: string;
};
const UserProfileResult = ({ username }: ResultProps) => {
    // fetching
    const { data, isLoading } = useQuery({ key: ["user__username", username] });

    if (isLoading) {
        return (
            <>
                <AbsentTopline title="Loading..." />

                <div
                    className={`box max-w-400 mt-2 w-full m-auto min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingProfile />
                </div>
            </>
        );
    }

    if (!data) {
        return (
            <>
                <AbsentTopline title="User does not exist!" />

                <div
                    className={`box max-w-400 mt-2 w-full m-auto min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingProfile />
                </div>
            </>
        );
    }

    return (
        <>
            <Topline data={data} />

            <div
                className={`box max-w-400 w-full m-auto rounded-4xl! min-h-128 overflow-hidden`}
            >
                <Content data={data} />
            </div>
        </>
    );
};

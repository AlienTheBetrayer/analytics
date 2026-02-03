"use client";
import { AbsentTopline } from "@/features/ui/loading/components/AbsentTopline";
import { LoadingEmulate } from "@/features/ui/loading/components/LoadingEmulate";
import { Select } from "@/features/posts/components/Select";
import { Topline } from "@/features/posts/components/Topline";
import { useParams } from "next/navigation";
import { useQuery } from "@/query/core";

export const Posts = () => {
    // url
    const { username } = useParams<{ id?: string; username?: string }>();

    // fetching
    const { data: status } = useQuery({ key: ["status"] });

    const name = username ?? status?.username;

    // wrong username
    if (!name) {
        return (
            <>
                <AbsentTopline
                    title="Incorrect username."
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

    return <PostsResult name={name} />;
};

type ResultProps = {
    name: string;
};
const PostsResult = ({ name }: ResultProps) => {
    // fetching
    const { data, isLoading } = useQuery({ key: ["user__username", name] });

    if (isLoading) {
        return (
            <>
                <AbsentTopline
                    title="Loading..."
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

    if (!data) {
        return (
            <>
                <AbsentTopline
                    title="No user found."
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

    return (
        <>
            <Topline type="posts" />

            <div className="box max-w-400 w-full mx-auto min-h-128 rounded-4xl!">
                <Select
                    type="posts"
                    data={data}
                />
            </div>
        </>
    );
};

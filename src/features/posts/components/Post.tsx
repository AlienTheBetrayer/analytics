"use client";
import { AbsentTopline } from "@/features/ui/loading/components/AbsentTopline";
import { LoadingEmulate } from "@/features/ui/loading/components/LoadingEmulate";
import { Select } from "@/features/posts/components/Select";
import { Topline } from "@/features/posts/components/Topline";
import { useParams } from "next/navigation";
import { useQuery } from "@/query/core";

export const Post = () => {
    // url
    const { id } = useParams<{ id?: string; tab?: string }>();

    const { data: status } = useQuery({ key: ["status"] });

    // fallbacks
    let errorString = "";
    // no post
    if (!id && !status) {
        errorString = "Wrong URL";
    }

    if (errorString) {
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

    // the url is correct and a post has been found

    return <PostResult id={id} />;
};

type ResultProps = {
    id?: string;
};
const PostResult = ({ id }: ResultProps) => {
    // fetching
    const { data: post } = useQuery({ key: ["post", id] });

    return (
        <>
            <Topline
                type="post"
                data={post}
            />

            <div
                className={`box max-w-400 w-full mx-auto min-h-128 rounded-4xl! overflow-hidden`}
            >
                <Select
                    type="post"
                    data={post}
                />
            </div>
        </>
    );
};

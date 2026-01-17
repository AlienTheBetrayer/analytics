"use client";
import { AbsentTopline } from "@/features/loading/components/AbsentTopline";
import { LoadingEmulate } from "@/features/loading/components/LoadingEmulate";
import { Select } from "@/features/posts/components/Select";
import { Topline } from "@/features/posts/components/Topline";
import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export const Post = () => {
    // url
    const { id, tab } = useParams<{ id?: string; tab?: string }>();

    // zustand
    const posts = useAppStore((state) => state.posts);

    // fetching
    useEffect(() => {}, [id]);

    // fallbacks
    // no tab
    if (!tab) {
        return (
            <>
                <AbsentTopline title="Incorrect tab" />

                <div
                    className={`box max-w-400 w-full mx-auto p-0! min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingEmulate />
                </div>
            </>
        );
    }

    // no id
    if (!id) {
        return (
            <>
                <AbsentTopline title="User not found" />

                <div
                    className={`box max-w-400 w-full mx-auto p-0! min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingEmulate />
                </div>
            </>
        );
    }

    const post = posts[id];

    // no post
    if (!post) {
        return (
            <>
                <AbsentTopline title="Post does not exist" />

                <div
                    className={`box max-w-400 w-full mx-auto p-0! min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingEmulate />
                </div>
            </>
        );
    }

    // the url is correct and a post has been found
    return (
        <>
            <Topline
                type="post"
                data={post}
            />

            <div
                className={`box max-w-400 w-full mx-auto p-0! min-h-128 rounded-4xl! overflow-hidden`}
            >
                <Select
                    type="post"
                    data={post}
                />
            </div>
        </>
    );
};

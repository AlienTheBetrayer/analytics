"use client";
import { AbsentTopline } from "@/features/loading/components/AbsentTopline";
import { LoadingEmulate } from "@/features/loading/components/LoadingEmulate";
import { Select } from "@/features/posts/components/Select";
import { Topline } from "@/features/posts/components/Topline";
import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export const Post = () => {
    // url
    const { id, tab } = useParams<{ id?: string; tab?: string }>();

    // zustand
    const posts = useAppStore((state) => state.posts);
    const status = useAppStore((state) => state.status);
    const getPosts = useAppStore((state) => state.getPosts);

    // fetching
    const hasFetched = useRef<boolean>(false);
    useEffect(() => {
        if (!id || hasFetched.current) {
            return;
        }

        getPosts({ type: "single", id });
        hasFetched.current = true;
    }, [id, getPosts]);

    // fallbacks
    let errorString = "";

    // not logged in and tab is create
    if (!status && tab === "create") {
        errorString = "Not authenticated";
    }

    // no tab
    if (!tab || (tab !== "create" && !id)) {
        errorString = "Incorrect URL";
    }

    // no post
    const post = id ? posts[id] : undefined;
    
    if (tab !== "create" && !post) {
        errorString = "Post does not exist";
    }

    if (errorString) {
        return (
            <>
                <AbsentTopline
                    title="Post does not exist"
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

"use client";
import { AbsentTopline } from "@/features/ui/loading/components/AbsentTopline";
import { LoadingEmulate } from "@/features/ui/loading/components/LoadingEmulate";
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
    const postIds = useAppStore((state) => state.postIds);
    const status = useAppStore((state) => state.status);
    const getPosts = useAppStore((state) => state.getPosts);

    // fetching
    useEffect(() => {
        if (!id) {
            return;
        }

        getPosts({ type: "single", id, user_id: status?.id });
    }, [id, getPosts, status]);

    // fallbacks
    let errorString = "";

    // no post
    const post = id ? posts[id] : undefined;

    if (tab !== "create" && !post) {
        errorString = "Post does not exist";
    }

    // trying to do anything other than view other posts (or not logged in)
    if (
        tab !== "view" &&
        (!status || (id && !postIds[status.username]?.has(id)))
    ) {
        errorString = "Not authenticated";
    }

    // no tab or create tab has no id
    if (!tab || (tab !== "create" && !id)) {
        errorString = "Incorrect URL";
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

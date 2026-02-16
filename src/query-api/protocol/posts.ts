import { CacheAPIFunctions, CacheAPIProtocol } from "@/query-api/protocol";
import { __posts } from "@/query-api/utils";
import { queryMutate } from "@/query/auxiliary";
import { Comment, Post, PostPrivacy } from "@/types/tables/posts";
import axios from "axios";

/**
 * state
 */
export type CacheAPIProtocolPosts = {
    posts: {
        key: ["posts", string];
        data: string[];
    };
    post: {
        key: ["post", string];
        data: Post & { has_liked: boolean; likes: number };
    };
    post_privacy: {
        key: ["post_privacy", string];
        data: PostPrivacy | null;
    };

    comments: {
        key: ["comments", string];
        data: string[];
    };
    comment: {
        key: ["comment", string];
        data: Comment & {
            has_liked: boolean;
            has_disliked: boolean;
            likes: number;
        };
    };
};

/**
 * functions
 */
export const CacheAPIFunctionsPosts: CacheAPIFunctions<CacheAPIProtocolPosts> =
    {
        posts: async (args: unknown[]) => {
            return __posts(args, "user_ids");
        },
        post_privacy: async (args: unknown[]) => {
            if (!args[0]) {
                throw new Error("post_ids is undefined");
            }

            const privacy = (
                await axios.get("/api/get/post_privacy", {
                    params: { post_ids: args[0] },
                })
            ).data?.privacy?.[0] as PostPrivacy;

            return privacy;
        },

        post: async (args: unknown[]) => {
            if (!args[0]) {
                throw new Error("post_id is undefined");
            }

            return (
                await axios.get("/api/get/posts", {
                    params: { post_ids: args[0] },
                })
            ).data?.posts?.[0];
        },

        // comments
        comments: async (args: unknown[]) => {
            if (!args[0]) {
                throw new Error("post_id is undefined");
            }

            const data = (
                await axios.get("/api/get/comments", {
                    params: { post_id: args[0] },
                })
            ).data.comments as CacheAPIProtocol["comment"]["data"][];

            for (const comment of data) {
                queryMutate({ key: ["comment", comment.id], value: comment });
            }

            const user_ids = [...new Set(data.map((d) => d.user_id))];

            const users = (
                await axios.get("/api/get/users", {
                    params: { user_ids: user_ids.join(",") },
                })
            ).data.users;

            for (const user of users) {
                queryMutate({ key: ["user", user.id], value: user });
                queryMutate({
                    key: ["user__username", user.username],
                    value: user,
                });
            }

            return data.map((d) => d.id);
        },

        comment: async (args: unknown[]) => {
            if (!args[0]) {
                throw new Error("comment_id is undefined");
            }

            const data = (
                await axios.get("/api/get/comments", {
                    params: { comment_id: args[0] },
                })
            ).data.comments?.[0] as CacheAPIProtocol["comment"]["data"];

            return data;
        },
    };

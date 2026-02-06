import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryMutate } from "@/query/auxiliary";
import { ContactMessage } from "@/types/tables/contact";
import { PostPrivacy } from "@/types/tables/posts";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";
import axios from "axios";

export const __user = async (args: unknown[], type: "id" | "name") => {
    if (!args[0]) {
        throw new Error("user_names and user_ids are undefined");
    }

    const user = (
        await axios.get("/api/get/users", {
            params:
                type === "name"
                    ? { user_names: args[0] }
                    : { user_ids: args[0] },
        })
    ).data?.users?.[0] as CacheAPIProtocol["user"]["data"];

    if (user.post_ids.length) {
        await __posts([user.post_ids], "post_id");
    }

    if (user) {
        queryMutate({ key: ["user", user.id], value: user });
    }

    return user;
};

export const __posts = async (
    args: unknown[],
    type: "user_ids" | "post_id",
) => {
    if (!args[0]) {
        throw new Error("user_ids and post_id is undefined");
    }

    const posts = (
        await axios.get("/api/get/posts", {
            params:
                type === "user_ids"
                    ? { user_ids: args[0] }
                    : { post_ids: (args[0] as string[]).join(",") },
        })
    ).data.posts as CacheAPIProtocol["post"]["data"][];
    const post_ids = posts.map((p) => p.id);

    for (const post of posts) {
        queryMutate({ key: ["post", post.id], value: post });
    }

    if (post_ids.length) {
        // caching and normalizing them all
        const [privacies] = await Promise.all([
            axios.get("/api/get/post_privacy", {
                params: { post_ids: post_ids.join(",") },
            }),
        ]);

        for (const post_id of post_ids) {
            const privacy = (privacies.data.privacy as PostPrivacy[]).find(
                (p) => p.post_id === post_id,
            );

            queryMutate({
                key: ["post_privacy", post_id],
                value: privacy ?? null,
            });
        }
    }

    return post_ids;
};

export const __contact = async (type: "single" | "all", ids: string[]) => {
    const messages = (
        await refreshedRequest({
            route: "/api/get/contact_message",
            method: "GET",
            config: {
                params: {
                    message_ids: ids.join(","),
                },
            },
        })
    ).data.messages as ContactMessage[];

    if (messages?.length) {
        const users = (
            await axios.get("/api/get/users", {
                params: {
                    user_ids: messages.map((m) => m.user_id).join(","),
                },
            })
        ).data.users as CacheAPIProtocol["user"]["data"][];

        if (type === "all") {
            for (const message of messages) {
                queryMutate({
                    key: ["contact_message", message.id],
                    value: message,
                });
            }
        }

        for (const user of users) {
            queryMutate({
                key: ["user", user.id],
                value: user,
            });
        }
    }

    return messages;
};

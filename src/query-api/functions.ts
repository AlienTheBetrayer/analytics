/* eslint-disable @typescript-eslint/no-unused-vars */
import { CacheAPIProtocol } from "@/query-api/protocol";
import { __contact, __posts, __user } from "@/query-api/utils";
import { queryMutate } from "@/query/auxiliary";
import { CacheKey, CacheKeyEntity, CacheValue } from "@/query/types/types";
import { PostPrivacy } from "@/types/tables/posts";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";
import axios from "axios";

export const CacheAPIFunctions: Record<
    CacheKeyEntity,
    (args: unknown[]) => Promise<CacheValue>
> = {
    // auth
    status: async () => {
        return (await axios.get("/api/auth/status")).data.status;
    },
    sessions: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("user_id is undefined");
        }

        return (
            await refreshedRequest({
                route: "/api/get/sessions",
                method: "GET",
                config: { params: { user_id: args[0] } },
            })
        ).data.sessions;
    },

    // messages
    conversations: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("username is undefined");
        }

        const data = (
            await refreshedRequest({
                route: "/api/get/conversations",
                method: "GET",
                config: { params: { username: args[0] } },
            })
        ).data.conversations as CacheAPIProtocol["conversations"]["data"];

        return data;
    },

    messages: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("conversation_id is undefined");
        }

        return await axios.get("/api/get/messages", {
            params: { conversation_id: args[0] },
        });
    },

    // contact
    contact_messages: async (args: unknown[]) => {
        const ids = (
            await refreshedRequest({
                route: "/api/get/contact_messages",
                method: "GET",
                config: { params: { user_id: args[0] } },
            })
        ).data.ids as string[];

        if (ids?.length) {
            await __contact("all", ids);
        }

        return ids;
    },
    contact_message: async (args: unknown[]) => {
        if (!args[0] || typeof args[0] !== "string") {
            throw new Error("message_id are undefined");
        }

        return (await __contact("single", [args[0]]))?.[0];
    },

    // relationship
    relationship: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("from_id is undefined");
        }

        if (!args[1]) {
            throw new Error("to_id is undefined");
        }

        return (
            await axios.get("/api/get/relationship", {
                params: { from_id: args[0], to_id: args[1] },
            })
        ).data.relationship;
    },

    // users
    user: async (args: unknown[]) => {
        return __user(args, "id");
    },
    user__username: async (args: unknown[]) => {
        return __user(args, "name");
    },

    // colors
    colors: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("user_id is undefined");
        }

        return (
            await axios.get("/api/get/colors", {
                params: { user_id: args[0] },
            })
        ).data.colors;
    },

    // friends
    friends: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("user_id is undefined");
        }

        const friends = (
            await axios.get("/api/get/friends/", {
                params: { user_id: args[0] },
            })
        ).data.friends as string[];

        if (friends.length) {
            const user_ids = friends.join(",");

            // caching and normalizing them all
            const users = await axios.get("/api/get/users", {
                params: { user_ids },
            });

            for (const user of users.data.users) {
                queryMutate({ key: ["user", user.id], value: user });
                queryMutate({
                    key: ["user__username", user.username],
                    value: user,
                });
            }
        }

        return friends;
    },

    // friend requests
    requests_incoming: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("user_id is undefined");
        }

        const requests = (
            await axios.get("/api/get/requests_incoming/", {
                params: { user_id: args[0] },
            })
        ).data.requests as string[];
        const user_ids = requests.join(",");

        if (user_ids.length) {
            // caching and normalizing them all
            const users = await axios.get("/api/get/users", {
                params: { user_ids },
            });

            for (const user of users.data.users) {
                queryMutate({ key: ["user", user.id], value: user });
                queryMutate({
                    key: ["user__username", user.username],
                    value: user,
                });
            }
        }

        return requests;
    },
    requests_outcoming: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("user_id is undefined");
        }

        const requests = (
            await axios.get("/api/get/requests_outcoming/", {
                params: { user_id: args[0] },
            })
        ).data.requests as string[];
        const user_ids = requests.join(",");

        if (user_ids.length) {
            // caching and normalizing them all
            const users = await axios.get("/api/get/users", {
                params: { user_ids },
            });

            for (const user of users.data.users) {
                queryMutate({ key: ["user", user.id], value: user });
                queryMutate({
                    key: ["user__username", user.username],
                    value: user,
                });
            }
        }

        return requests;
    },

    // posts
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

    // dashboard
    projects: async (args: unknown[]) => {
        return (
            await refreshedRequest({
                route: "/api/get/projects",
                method: "GET",
            })
        ).data.projects;
    },
    events: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("project_id is undefined");
        }

        return (
            await refreshedRequest({
                route: "/api/get/events",
                method: "GET",
                config: {
                    params: {
                        project_id: args[0],
                    },
                },
            })
        ).data.events;
    },

    // search
    search: async (args: unknown[]) => {
        if (!(0 in args)) {
            throw new Error("query is undefined");
        }

        if (!(1 in args)) {
            throw new Error("page is undefined");
        }

        // getting the view (IDs only)
        const data = (
            await axios.get("/api/get/search", {
                params: { query: args[0], page: args[1] },
            })
        ).data as { ids: { id: string; post_ids: string[] }[]; pages: number };

        const user_ids = data.ids.map((d) => d.id).join(",");

        if (!user_ids) {
            return data;
        }

        // caching and normalizing them all
        const [users, posts] = await Promise.all([
            axios.get("/api/get/users", { params: { user_ids } }),
            axios.get("/api/get/posts", { params: { user_ids } }),
        ]);

        for (const user of users.data.users) {
            queryMutate({ key: ["user", user.id], value: user });
            queryMutate({
                key: ["user__username", user.username],
                value: user,
            });
        }

        for (const post of posts.data.posts) {
            queryMutate({ key: ["post", post.id], value: post });
        }

        return data;
    },
};

/**
 * resolves and calls an official function with the given key and returns the value from it
 * @param key array-like key
 * @returns a promise with the value from the function from the key
 */
export const resolveAPIFunction = async (options: { key: CacheKey }) => {
    const [entity, ...args] = options.key;
    const handler = CacheAPIFunctions[entity];

    if (!handler) {
        throw new Error(
            `No handler defined for entity: ${entity} with args: ${args}`,
        );
    }

    return handler(args);
};

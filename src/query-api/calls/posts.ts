import { notificationListeners } from "@/notifications/data/init";
import { queryInvalidate } from "@/query/auxiliary";
import { PostPrivacy } from "@/types/tables/posts";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export type PostData = {
    title: string;
    content: string;
    image?: string | null;
    image_name?: string;
    image_type?: string;
};

export const updatePost = async (
    options: (
        | { type: "delete"; id: string }
        | { type: "edit"; id: string; data: PostData }
        | { type: "create"; data: PostData }
        | { type: "privacy"; id: string; privacy: Partial<PostPrivacy> }
    ) & { user_id: string },
) => {
    const res = await refreshedRequest({
        route: "/api/update/post/",
        method: "POST",
        body: {
            user_id: options.user_id,
            ...("data" in options && options.data),
            ...("id" in options && { id: options.id }),
            ...("privacy" in options && {
                privacy: options.privacy,
            }),
            type: options.type,
        },
    });

    queryInvalidate({ key: ["posts", options.user_id] });

    switch (options.type) {
        case "delete": {
            notificationListeners.fire({
                key: "all",
                notification: {
                    status: "Warning",
                    tab: "Account",
                    title: "Post deletion",
                    description: "A post created by you has just been deleted",
                    type: "Post deleted",
                },
            });
            break;
        }
        default: {
            notificationListeners.fire({
                key: "all",
                notification: {
                    status: "Information",
                    tab: "Account",
                    title: "Post changed!",
                    description:
                        "You have just successfully modified your post!",
                    type: "Post changed",
                },
            });
            break;
        }
    }

    return res;
};

export const like = async (
    options: (
        | { type: "like"; id: string }
        | { type: "dislike"; id: string }
    ) & { user_id: string; what: "post" | "comment" },
) => {
    const res = await refreshedRequest({
        route: "/api/update/like",
        method: "POST",
        body: {
            type: options.type,
            what: options.what,
            id: options.id,
            user_id: options.user_id,
        },
    });

    switch (options.what) {
        case "post": {
            queryInvalidate({ key: ["post", options.id] });
            break;
        }
        case "comment": {
            queryInvalidate({ key: ["comment", options.id] });
            break;
        }
    }

    return res;
};

export const updateComment = async (
    options: (
        | { type: "send"; comment: string }
        | { type: "edit"; comment_id: string; comment: string }
        | { type: "delete"; comment_id: string }
    ) & { user_id: string; post_id: string },
) => {
    const res = await refreshedRequest({
        route: "/api/update/comment",
        method: "POST",
        body: {
            user_id: options.user_id,
            type: options.type,
            ...("post_id" in options && {
                post_id: options.post_id,
            }),
            ...("comment" in options && {
                comment: options.comment,
            }),
            ...("comment_id" in options && {
                comment_id: options.comment_id,
            }),
        },
    });

    switch (options.type) {
        case "send": {
            queryInvalidate({ key: ["comments", options.post_id] });
            break;
        }
        default: {
            queryInvalidate({ key: ["comment", options.comment_id] });
            break;
        }
    }

    return res;
};

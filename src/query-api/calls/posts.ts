import { notificationListeners } from "@/notifications/data/init";
import { queryDelete, queryInvalidate, queryMutate } from "@/query/auxiliary";
import { Comment, PostPrivacy } from "@/types/tables/posts";
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
                    description: "You have just successfully modified your post!",
                    type: "Post changed",
                },
            });
            break;
        }
    }

    return res;
};

export const like = async (
    options: ({ type: "like"; id: string } | { type: "dislike"; id: string }) & {
        user_id: string;
        what: "post" | "comment";
    },
) => {
    switch (options.what) {
        case "post": {
            queryMutate({
                key: ["post", options.id],
                value: (state) => {
                    return {
                        ...state,
                        has_liked: !state.has_liked,
                        likes: state.has_liked ? state.likes - 1 : state.likes + 1,
                    };
                },
            });
            break;
        }
        case "comment": {
            queryMutate({
                key: ["comment", options.id],
                value: (state) => {
                    const properties =
                        options.type === "like" ?
                            {
                                has_liked: !state.has_liked,
                                has_disliked: !state.has_liked ? false : state.has_disliked,
                                likes: state.has_liked ? state.likes - 1 : state.likes + 1,
                            }
                        :   {
                                has_disliked: !state.has_disliked,
                                has_liked: !state.has_disliked ? false : state.has_liked,
                                likes: state.has_liked ? state.likes - 1 : state.likes,
                            };

                    return {
                        ...state,
                        ...properties,
                    };
                },
            });
            break;
        }
    }

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

    return res;
};

export const updateComment = async (
    options: (
        | { type: "send"; comment: string }
        | { type: "edit"; comment_id: string; comment: string }
        | { type: "delete"; comment_id: string }
    ) & { user_id: string; post_id: string },
) => {
    switch (options.type) {
        case "edit": {
            queryMutate({
                key: ["comment", options.comment_id],
                value: (state) => {
                    return { ...state, comment: options.comment, edited_at: new Date().toISOString() };
                },
            });
            break;
        }
        case "delete": {
            queryMutate({
                key: ["comments", options.post_id],
                value: (state) => state.filter((id) => id !== options.comment_id),
            });
            queryDelete({ key: ["comment", options.comment_id] });
            break;
        }
    }

    const comment = (
        await refreshedRequest({
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
        })
    ).data.comment as Comment;

    if (options.type === "send") {
        queryMutate({
            key: ["comment", comment.id],
            value: { ...comment, has_liked: false, has_disliked: false, likes: 0 },
        });
        queryMutate({ key: ["comments", comment.post_id], value: (state) => [...(state ?? []), comment.id] });
    }

    return comment;
};

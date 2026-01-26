import { Profile, User } from "@/types/tables/account";
import { Comment, Post } from "@/types/tables/posts";
import { PostStore } from "@/types/zustand/posts";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

const cache = new Set();

export const PostSlice: SliceFunction<PostStore> = (set, get) => {
    return {
        posts: {},
        postLikeIds: {},
        postIds: {},
        postLikes: {},
        commentIds: {},
        commentLikeIds: {},
        commentLikes: {},
        postFiltering: {
            column: undefined,
            filter: "",
        },
        likes: {},
        comments: {},
        postPrivacy: {},

        updatePostFiltering: (filtering) => {
            set((state) => ({
                ...state,
                postFiltering: { ...state.postFiltering, ...filtering },
            }));
        },

        getPosts: async (options) => {
            const { setPromise } = get();

            // cache
            if (
                (options.caching ?? true) &&
                cache.has(
                    `${"username" in options && options.username}${"id" in options && options.id}${options.user_id}`,
                )
            ) {
                return;
            }

            return await setPromise(
                options.promiseKey ?? "getPosts",
                async () => {
                    const res = await refreshedRequest(
                        "/api/posts/",
                        "GET",
                        undefined,
                        {
                            params: {
                                type: options.type,
                                ...(options.type === "single" && {
                                    id: options.id,
                                }),
                                ...(options.type === "all" && {
                                    username: options.username,
                                }),
                                ...(options.user_id && {
                                    user_id: options.user_id,
                                }),
                            },
                        },
                    );

                    cache.add(
                        `${"username" in options && options.username}${"id" in options && options.id}${options.user_id}`,
                    );

                    const data = res.data as {
                        results: User & {
                            profile: Profile;
                            posts: (Post & { post_likes: number } & {
                                privacy: {
                                    likes: boolean;
                                    comments: boolean;
                                    edited_at: string;
                                };
                            } & {
                                comments?: (Comment & {
                                    comment_likes: number;
                                })[];
                            })[];
                        };
                        ownPostLikes: string[];
                        ownCommentLikes: { id: string; like: boolean }[];
                    };

                    set((state) => {
                        const profiles = { ...state.profiles };
                        const users = { ...state.users };

                        const posts = { ...state.posts };
                        const postLikes = { ...state.postLikes };
                        const postPrivacy = { ...state.postPrivacy };
                        const comments = { ...state.comments };

                        const postIds = { ...state.postIds };
                        const postLikeIds = { ...state.postLikeIds };
                        const commentIds = { ...state.commentIds };
                        const commentLikeIds = { ...state.commentLikeIds };
                        const commentLikes = { ...state.commentLikes };

                        // user data
                        users[data.results.id] = {
                            id: data.results.id,
                            username: data.results.username,
                            role: data.results.role,
                            created_at: data.results.created_at,
                            last_seen_at: data.results.last_seen_at,
                        };
                        profiles[data.results.id] = data.results.profile;

                        // posts and post ids
                        const newPostIds = new Set(
                            state.postIds[data.results.username] ?? [],
                        );
                        for (const { post_likes, privacy, ...post } of data
                            .results.posts) {
                            posts[post.id] = post;
                            newPostIds.add(post.id);
                            postLikes[post.id] = post_likes;
                            postPrivacy[post.id] = privacy;
                        }
                        postIds[data.results.username] = newPostIds;

                        // post likes and like ids
                        const newLikeIds = new Set(
                            state.postLikeIds[data.results.username] ?? [],
                        );
                        for (const likeId of data.ownPostLikes) {
                            newLikeIds.add(likeId);
                        }
                        postLikeIds[data.results.username] = newLikeIds;

                        // comment likes and comment like ids
                        const newCommentIds = new Set(
                            state.commentLikeIds[data.results.username] ?? [],
                        );
                        for (const likeId of data.ownCommentLikes) {
                            newCommentIds.add(
                                `${likeId.id}:${likeId.like ? "like" : "dislike"}`,
                            );
                        }
                        commentLikeIds[data.results.username] = newCommentIds;

                        // comments and comment ids
                        if (
                            options.type === "single" &&
                            data.results.posts?.[0]?.comments?.length
                        ) {
                            const newCommentIds = new Set(
                                state.commentIds[options.id] ?? [],
                            );
                            for (const comment of data.results.posts[0]
                                ?.comments) {
                                newCommentIds.add(comment.id);
                                comments[comment.id] = comment;
                                commentLikes[comment.id] =
                                    comment.comment_likes;
                            }
                            commentIds[options.id] = newCommentIds;
                        }

                        return {
                            ...state,
                            posts,
                            comments,
                            profiles,
                            postPrivacy,
                            users,
                            postLikes,
                            postIds,
                            commentIds,
                            postLikeIds,
                            commentLikeIds,
                            commentLikes,
                        };
                    });

                    return data;
                },
            );
        },

        updatePost: async (options) => {
            const { setPromise } = get();

            return await setPromise(
                options.promiseKey ?? "updatePost",
                async () => {
                    const res = await refreshedRequest(
                        "/api/post-update/",
                        "POST",
                        {
                            user_id: options.user_id,
                            ...("data" in options && options.data),
                            ...("id" in options && { id: options.id }),
                            ...("privacy" in options && {
                                privacy: options.privacy,
                            }),
                            type: options.type,
                        },
                    );

                    const data = res.data.post as Post;

                    set((state) => {
                        const posts = { ...state.posts };
                        const postIds = { ...state.postIds };
                        const postPrivacy = { ...state.postPrivacy };

                        switch (options.type) {
                            case "delete": {
                                delete posts[data.id];

                                const username =
                                    state.users[data.user_id]?.username;
                                if (username && postIds[username]) {
                                    postIds[username] = new Set(
                                        [...postIds[username]].filter(
                                            (id) => id !== data.id,
                                        ),
                                    );
                                }
                                break;
                            }
                            case "privacy": {
                                postPrivacy[options.id] = {
                                    ...(state.postPrivacy[options.id] ?? {}),
                                    ...options.privacy,
                                };
                                break;
                            }
                            default: {
                                posts[data.id] = data;

                                const username =
                                    state.users[data.user_id]?.username;
                                if (username) {
                                    postIds[username] = new Set([
                                        ...(postIds[username] ?? []),
                                        data.id,
                                    ]);
                                }
                                break;
                            }
                        }

                        return { ...state, posts, postIds, postPrivacy };
                    });

                    return data;
                },
            );
        },

        like: async (options) => {
            const { setPromise } = get();

            return await setPromise(
                options.promiseKey ?? "likePost",
                async () => {
                    set((state) => {
                        if (options.what === "post") {
                            const postLikes = { ...state.postLikes };
                            const postLikeIds = { ...state.postLikeIds };

                            const username =
                                state.users[options.user_id]?.username;

                            if (username) {
                                if (!postLikeIds[username]?.has(options.id)) {
                                    postLikeIds[username] = new Set([
                                        ...(postLikeIds[username] ?? []),
                                        options.id,
                                    ]);
                                    postLikes[options.id] =
                                        (postLikes[options.id] ?? 0) + 1;
                                } else {
                                    postLikeIds[username] = new Set(
                                        [
                                            ...(postLikeIds[username] ?? []),
                                        ].filter((id) => id !== options.id),
                                    );
                                    postLikes[options.id] =
                                        (postLikes[options.id] ?? 1) - 1;
                                }
                            }

                            return { ...state, postLikes, postLikeIds };
                        } else {
                            const commentLikes = { ...state.commentLikes };
                            const commentLikeIds = { ...state.commentLikeIds };

                            const username =
                                state.users[options.user_id]?.username;

                            if (username) {
                                const ids = new Set(
                                    [
                                        ...(commentLikeIds[username] ?? []),
                                    ].filter(
                                        (id) => !id.startsWith(options.id),
                                    ),
                                );

                                // adding only if it's a different button
                                if (
                                    !commentLikeIds[username]?.has(
                                        `${options.id}:${options.type}`,
                                    )
                                ) {
                                    ids.add(`${options.id}:${options.type}`);

                                    if (options.type === "dislike") {
                                        commentLikes[options.id] =
                                            (commentLikes[options.id] || 1) - 1;
                                    } else {
                                        commentLikes[options.id] =
                                            (commentLikes[options.id] ?? 0) + 1;
                                    }
                                } else {
                                    // unpressing the same button
                                    commentLikes[options.id] =
                                        (commentLikes[options.id] || 1) - 1;
                                }

                                commentLikeIds[username] = ids;
                            }

                            return { ...state, commentLikes, commentLikeIds };
                        }
                    });

                    await refreshedRequest("/api/like", "POST", {
                        type: options.type,
                        what: options.what,
                        id: options.id,
                        user_id: options.user_id,
                    });
                },
            );
        },

        updateComment: async (options) => {
            const { setPromise } = get();

            return await setPromise(
                options.promiseKey ?? "updateComment",
                async () => {
                    const res = await refreshedRequest(
                        "/api/comment-update/",
                        "POST",
                        {
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
                    );

                    const data = res.data.comment as Comment;

                    set((state) => {
                        const comments = { ...state.comments };
                        const commentIds = { ...state.commentIds };

                        switch (options.type) {
                            case "delete": {
                                delete comments[options.comment_id];
                                commentIds[data.post_id] = new Set(
                                    [
                                        ...(state.commentIds[data.post_id] ??
                                            []),
                                    ].filter((id) => id !== options.comment_id),
                                );
                                break;
                            }
                            case "send": {
                                commentIds[options.post_id] = new Set([
                                    ...(state.commentIds[options.post_id] ??
                                        []),
                                    data.id,
                                ]);
                                comments[data.id] = data;

                                break;
                            }
                            case "edit": {
                                comments[data.id] = data;
                                console.log(data);
                                break;
                            }
                        }

                        return { ...state, comments, commentIds };
                    });
                },
            );
        },
    };
};

import { Profile, User } from "@/types/tables/account";
import { Comment, Post } from "@/types/tables/posts";
import { PostStore } from "@/types/zustand/posts";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

const cache = new Set();

export const PostSlice: SliceFunction<PostStore> = (set, get) => {
    return {
        posts: {},
        postIds: {},
        likeIds: {},
        commentIds: {},
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
                            posts: (Post & { likes: number } & {
                                privacy: {
                                    likes: boolean;
                                    comments: boolean;
                                    edited_at: string;
                                };
                            })[];
                        };
                        ownLikes: string[];
                    };

                    set((state) => {
                        const profiles = { ...state.profiles };
                        const users = { ...state.users };
                        const posts = { ...state.posts };
                        const postIds = { ...state.postIds };
                        const likeIds = { ...state.likeIds };
                        const likes = { ...state.likes };
                        const postPrivacy = { ...state.postPrivacy };

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
                            state.postIds[data.results.username],
                        );
                        for (const {
                            likes: postLikes,
                            privacy,
                            ...post
                        } of data.results.posts) {
                            posts[post.id] = post;
                            newPostIds.add(post.id);
                            likes[post.id] = postLikes;
                            postPrivacy[post.id] = privacy;
                        }
                        postIds[data.results.username] = newPostIds;

                        // likes and like ids
                        const newLikeIds = new Set(
                            state.likeIds[data.results.username],
                        );
                        for (const likeId of data.ownLikes) {
                            newLikeIds.add(likeId);
                        }
                        likeIds[data.results.username] = newLikeIds;

                        return {
                            ...state,
                            posts,
                            postIds,
                            postPrivacy,
                            profiles,
                            users,
                            likeIds,
                            likes,
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

        likePost: async (options) => {
            const { setPromise } = get();

            return await setPromise(
                options.promiseKey ?? "likePost",
                async () => {
                    set((state) => {
                        const likeIds = { ...state.likeIds };
                        const posts = { ...state.posts };
                        const likes = { ...state.likes };

                        switch (options.type) {
                            case "like": {
                                const username =
                                    state.users[options.user_id]?.username;
                                if (username) {
                                    likeIds[username] = new Set([
                                        ...(likeIds[username] ?? []),
                                        options.id,
                                    ]);
                                }
                                likes[options.id] = likes[options.id] + 1;

                                break;
                            }
                            case "unlike": {
                                const username =
                                    state.users[options.user_id]?.username;
                                if (username && likeIds[username]) {
                                    likeIds[username] = new Set(
                                        [...likeIds[username]].filter(
                                            (id) => id !== options.id,
                                        ),
                                    );
                                }
                                likes[options.id] = likes[options.id] - 1;

                                break;
                            }
                        }

                        return {
                            ...state,
                            likeIds,
                            likes,
                            posts,
                        };
                    });

                    await refreshedRequest("/api/like", "POST", {
                        type: options.type,
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
                        "/api/comment/",
                        "POST",
                        {
                            user_id: options.user_id,
                            type: options.type,
                            post_id: options.post_id,
                            ...(options.type !== "delete" && {
                                comment: options.comment,
                            }),
                            ...(options.type === "edit" && {
                                comment_id: options.comment_id,
                            }),
                        },
                    );

                    const data = res.data as Comment;
                    console.log(data);

                    set((state) => {
                        const comments = { ...state.comments };

                        switch (options.type) {
                            case "delete": {
                                break;
                            }
                            default: {
                                break;
                            }
                        }

                        return { ...state, comments };
                    });
                },
            );
        },
    };
};

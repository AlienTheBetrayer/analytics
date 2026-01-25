import { Profile, User } from "@/types/tables/account";
import { Post } from "@/types/tables/posts";
import { PostStore } from "@/types/zustand/posts";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

const cache = new Set();

export const PostSlice: SliceFunction<PostStore> = (set, get) => {
    return {
        posts: {},
        postIds: {},
        likeIds: {},
        postFiltering: {
            column: undefined,
            filter: "",
        },

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
                            posts: (Post & { likes: number })[];
                        };
                        ownLikes: string[];
                    };

                    set((state) => {
                        const profiles = { ...state.profiles };
                        const users = { ...state.users };
                        const posts = { ...state.posts };
                        const postIds = { ...state.postIds };
                        const likeIds = { ...state.likeIds };

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
                        for (const post of data.results.posts) {
                            posts[post.id] = post;
                            newPostIds.add(post.id);
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
                            profiles,
                            users,
                            likeIds,
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
                            ...("data" in options ? options.data : {}),
                            ...("id" in options ? { id: options.id } : {}),
                            type: options.type,
                        },
                    );

                    const data = res.data.post as Post;

                    set((state) => {
                        const posts = { ...state.posts };
                        const postIds = { ...state.postIds };

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

                        return { ...state, posts, postIds };
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
                    await refreshedRequest("/api/like", "POST", {
                        type: options.type,
                        id: options.id,
                        user_id: options.user_id,
                    });

                    set((state) => {
                        const likeIds = { ...state.likeIds };
                        const posts = { ...state.posts };

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
                                posts[options.id].likes = String(
                                    Number(posts[options.id].likes ?? "0") + 1,
                                );

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
                                posts[options.id].likes = String(
                                    Number(posts[options.id].likes ?? "1") - 1,
                                );

                                break;
                            }
                        }

                        return {
                            ...state,
                            likeIds,
                            posts,
                            // posts: {
                            //     ...state.posts,
                            //     [options.id]: { ...(state.posts[options.id] ?? {}), likes: state.posts[options.id].likes },
                            // },
                        };
                    });
                },
            );
        },
    };
};

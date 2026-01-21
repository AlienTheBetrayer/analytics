import { Profile, User } from "@/types/tables/account";
import { Post } from "@/types/tables/posts";
import { PostStore } from "@/types/zustand/posts";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const PostSlice: SliceFunction<PostStore> = (set, get) => {
    return {
        posts: {},
        postIds: {},

        getPosts: async (options) => {
            const { setPromise, postIds } = get();

            if (
                options.type === "all" &&
                options.caching &&
                postIds[options.username]
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
                            },
                        },
                    );

                    const data = res.data as User & {
                        profile: Profile;
                        posts: Post[];
                    };

                    set((state) => {
                        const posts = { ...state.posts };
                        const profiles = { ...state.profiles };
                        const users = { ...state.users };
                        const postIds = { ...state.postIds };

                        const ids: string[] = [];

                        for (const post of data.posts) {
                            posts[post.id] = post;
                            ids.push(post.id);
                        }

                        postIds[data.username] = ids;

                        users[data.id] = {
                            id: data.id,
                            username: data.username,
                            role: data.role,
                            created_at: data.created_at,
                            last_seen_at: data.last_seen_at,
                        };

                        profiles[data.id] = data.profile;

                        return { ...state, posts, postIds, profiles, users };
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
                        { user_id: options.user_id, ...options.data },
                    );

                    const data = res.data;

                    return data;
                },
            );
        },
    };
};

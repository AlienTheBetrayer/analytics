import { PostStore } from "@/types/zustand/posts";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const PostSlice: SliceFunction<PostStore> = (set, get) => {
    return {
        posts: {},

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

                    const data = res.data;
                    console.log(data);

                    return data;
                },
            );
        },
    };
};

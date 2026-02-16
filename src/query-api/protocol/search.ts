import { CacheAPIFunctions } from "@/query-api/protocol";
import { queryMutate } from "@/query/auxiliary";
import axios from "axios";

/**
 * state
 */
export type CacheAPIProtocolSearch = {
    search: {
        key: ["search", string, number];
        data: {
            ids: { id: string; post_ids: string[] }[];
            pages: number;
        };
    };
};

/**
 * functions
 */
export const CacheAPIFunctionsSearch: CacheAPIFunctions<CacheAPIProtocolSearch> =
    {
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
            ).data as {
                ids: { id: string; post_ids: string[] }[];
                pages: number;
            };

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

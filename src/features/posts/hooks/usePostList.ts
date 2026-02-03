import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { queryCache } from "@/query/init";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";
import { useMemo } from "react";

export const usePostList = (data: CacheAPIProtocol["user"]["data"]) => {
    // zustand
    const postFiltering = useAppStore((state) => state.postFiltering);
    const display = useLocalStore((state) => state.display);

    const { data: postIds } = useQuery({ key: ["posts", data.id] });
    const { data: status } = useQuery({ key: ["status"] });

    // sorted object
    const filtered = useMemo(() => {
        if (!postIds?.length) {
            return;
        }

        const postsData = Array.from(
            postIds.map(
                (id) =>
                    queryCache.get({
                        key: ["post", id],
                    }) as CacheAPIProtocol["post"]["data"],
            ),
        );

        let allPosts = [...postsData];

        // sorting
        if (display.sorting.posts === "ascendant") {
            allPosts.reverse();
        }

        // filtering
        if (postFiltering.filter.trim()) {
            allPosts = allPosts.filter(
                (post) =>
                    post.title
                        .toLowerCase()
                        .includes(postFiltering.filter.toLowerCase()) ||
                    (post.content &&
                        post.content
                            .toLowerCase()
                            .includes(postFiltering.filter.toLowerCase())),
            );
        }

        // column filtering
        if (postFiltering.column) {
            switch (postFiltering.column) {
                case "Edited": {
                    allPosts = allPosts.filter((post) => post.edited_at);
                    break;
                }
                case "With Images": {
                    allPosts = allPosts.filter((post) => post.image_url);
                    break;
                }
                case "Liked": {
                    if (!status) {
                        break;
                    }

                    allPosts = allPosts.filter((post) => post.has_liked);
                    break;
                }
                case "Raw": {
                    if (!status) {
                        break;
                    }

                    allPosts = allPosts.filter(
                        (post) =>
                            !post.edited_at &&
                            !post.image_url &&
                            !post.has_liked,
                    );
                    break;
                }
            }
        }

        return allPosts;
    }, [postIds, postFiltering, display, status]);

    return { filtered };
};

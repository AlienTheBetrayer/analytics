import { User } from "@/types/tables/account";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";
import { useMemo } from "react";

export const usePostList = (user: User) => {
    // zustand
    const postFiltering = useAppStore((state) => state.postFiltering);
    const display = useLocalStore((state) => state.display);
    const posts = useAppStore((state) => state.posts);
    const postIds = useAppStore((state) => state.postIds);
    const status = useAppStore((state) => state.status);
    const likeIds = useAppStore((state) => state.likeIds);

    // sorted object
    const filtered = useMemo(() => {
        const postsData = Array.from(postIds[user.username]).map(
            (id) => posts[id],
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

                    allPosts = allPosts.filter((post) =>
                        likeIds[status.username].has(post.id),
                    );
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
                            !likeIds[status.username].has(post.id),
                    );
                    break;
                }
            }
        }

        return allPosts;
    }, [posts, postIds, postFiltering, display, user, status, likeIds]);

    return { filtered };
};

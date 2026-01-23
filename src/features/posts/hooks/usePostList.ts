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

    // sorted object
    const filtered = useMemo(() => {
        const postsData = Array.from(postIds[user.username]).map(
            (id) => posts[id],
        );
        let allPosts = [...postsData];

        // sorting
        const direction = display.sorting.posts === "descendant" ? -1 : 1;
        allPosts.sort(
            (a, b) =>
                (new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()) *
                direction,
        );

        // filtering
        if (postFiltering.filter.trim()) {
            allPosts = allPosts.filter(
                (post) =>
                    post.title
                        .toLowerCase()
                        .includes(postFiltering.filter.toLowerCase()) ||
                    post.content
                        .toLowerCase()
                        .includes(postFiltering.filter.toLowerCase()),
            );
        }

        return allPosts;
    }, [posts, postIds, postFiltering, display, user]);

    return { filtered };
};

import { Post } from "@/types/tables/posts";

export type PostData = {
    title?: string;
    content?: string;
    image?: string | null;
};

export type PostStore = {
    posts: Record<string, Post>;

    /**
     * gets all the posts along with the user and profile data attached to it
     * @param type whether to fetch a single post by id or all posts of a specific user
     * @param id an id of the post
     * @param username a username of the user
     * @param promiseKey a unique id for the promise status
     */
    getPosts: (
        options: (
            | { type: "single"; id: string }
            | { type: "all"; username: string }
        ) & { promiseKey?: string; caching?: boolean },
    ) => Promise<void>;

    updatePost: (
        options: (
            | { type: "edit"; id: string; data: PostData }
            | { type: "create"; data: PostData }
        ) & { user_id: string; promiseKey?: string },
    ) => Promise<void>;
};

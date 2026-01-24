import { Like, Post } from "@/types/tables/posts";

export type PostData = {
    title?: string;
    content?: string;
    image?: string | null;
    image_name?: string;
    image_type?: string;
};

export type PostFilteringColumn = "Liked" | "Edited" | "Raw" | "With Images";
export type PostFiltering = {
    filter: string;
    column: PostFilteringColumn;
};

export type PostStore = {
    // misc: searching / filtering
    postFiltering: PostFiltering;

    /**
     * post_id : Post
     */
    posts: Record<string, Post>;
    likes: Record<string, Like>;

    /**
     * username: post ids[]
     */
    postIds: Record<string, Set<string>>;
    likeIds: Record<string, Set<string>>;

    /**
     * updates the filtering metadata
     * @param sorting a partial sorting object
     */
    updatePostFiltering: (sorting: Partial<PostFiltering>) => void;

    /**
     * gets all the posts along with the user and profile data attached to it
     * @param type whether to fetch a single post by id or all posts of a specific user
     * @param id an id of the post
     * @param username a username of the user
     * @param promiseKey a unique id for the promise status
     * @param user_id user_id to fetch likes and comments (leave undefined if not logged in)
     */
    getPosts: (
        options: (
            | { type: "single"; id: string }
            | { type: "all"; username: string }
        ) & {
            promiseKey?: string;
            caching?: boolean;
            user_id: string | undefined;
        },
    ) => Promise<void>;

    /**
     * updates the post in a specified way (deletes / edits / creates)
     * @param type type of the API interaction
     * @param id [edit/delete]: id of the post needed
     * @param data [edit/create]: the updated data for the post
     * @param user_id the id of the user that wants to make a change
     * @param promiseKey a unique id for the promise status
     */
    updatePost: (
        options: (
            | { type: "delete"; id: string }
            | { type: "edit"; id: string; data: PostData }
            | { type: "create"; data: PostData }
        ) & { user_id: string; promiseKey?: string },
    ) => Promise<void>;

    /**
     * likes the post in a specific way (like / remove like)
     * @param type type of the API interaction
     * @param id  id of the post needed
     * @param user_id the id of the user that wants to make a change
     * @param promiseKey a unique id for the promise status
     */
    likePost: (
        options: (
            | { type: "like"; id: string }
            | { type: "unlike"; id: string }
        ) & { user_id: string; promiseKey?: string },
    ) => Promise<void>;
};

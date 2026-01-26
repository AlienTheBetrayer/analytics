import { Comment, Post, PostPrivacy } from "@/types/tables/posts";

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
    column: PostFilteringColumn | undefined;
};

export type PostStore = {
    // misc: searching / filtering
    postFiltering: PostFiltering;

    /**
     * post_id : Post
     */
    posts: Record<string, Post>;
    /**
     * post_id: like count
     */
    likes: Record<string, number>;
    /**
     * comment_id: Comment
     */
    comments: Record<string, Comment[]>;
    /**
     * post_id: PostPrivacy
     */
    postPrivacy: Record<
        string,
        { likes: boolean; comments: boolean; edited_at: string }
    >;

    /**
     * username: post ids[]
     */
    postIds: Record<string, Set<string>>;
    /**
     * username: post ids[]
     */
    likeIds: Record<string, Set<string>>;
    /**
     * post_id: comment ids[]
     */
    commentIds: Record<string, Set<string>>;

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
     * @param id [edit/delete/privacy]: id of the post needed
     * @param data [edit/create]: the updated data for the post
     * @param user_id the id of the user that wants to make a change
     * @param promiseKey a unique id for the promise status
     */
    updatePost: (
        options: (
            | { type: "delete"; id: string }
            | { type: "edit"; id: string; data: PostData }
            | { type: "create"; data: PostData }
            | { type: "privacy"; id: string; privacy: Partial<PostPrivacy> }
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

    /**
     * updates a comment in a specific way (send, edit or delete)
     * @param type type of the API interaction
     * @param comment comment's text
     * @param comment_id comment id needed for edit to work
     * @param user_id the id of the user that wants to make a change
     * @param promiseKey a unique id for the promise status
     */
    updateComment: (
        options: (
            | { type: "send"; comment: string }
            | { type: "edit"; comment_id: string; comment: string }
            | { type: "delete" }
        ) & { user_id: string; post_id: string; promiseKey?: string },
    ) => Promise<void>;
};

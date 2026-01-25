/**
 * posts
 */
export type Post = {
    id: string;
    user_id: string;
    title: string;
    content?: string;
    created_at: string;
    image_url?: string;
    edited_at?: string;
};

/**
 * likes
 */
export type Like = {
    id: string;
    user_id: string;
    post_id: string;
    created_at: string;
};

/**
 * comments
 */
export type Comment = {
    id: string;
    post_id: string;
    user_id: string;
    comment: string;
    created_at: string;
    edited_at?: string;
};

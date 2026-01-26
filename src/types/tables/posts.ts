/**
 * posts
 */
export type Post = {
    id: string;
    user_id: string;
    title: string;
    content?: string;
    image_url?: string;
    created_at: string;
    edited_at?: string;
};

/**
 * post_privacy
 */
export type PostPrivacy = {
    id: string;
    post_id: string;
    comments: boolean;
    likes: boolean;
    created_at: string;
    edited_at: string;
};

/**
 * post_likes
 */
export type PostLike = {
    id: string;
    user_id: string;
    post_id: string;
    created_at: string;
};

/**
 * comment_likes
 */
export type CommentLike = {
    id: string;
    user_id: string;
    comment_id: string;
    like: boolean;
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

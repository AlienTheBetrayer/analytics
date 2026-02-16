import { Post, PostPrivacy } from "@/types/tables/posts";

export type CacheAPIProtocolPosts = {
    posts: {
        key: ["posts", string];
        data: string[];
    };
    post: {
        key: ["post", string];
        data: Post & { has_liked: boolean; likes: number };
    };
    post_privacy: {
        key: ["post_privacy", string];
        data: PostPrivacy | null;
    };

    comments: {
        key: ["comments", string];
        data: string[];
    };
    comment: {
        key: ["comment", string];
        data: Comment & {
            has_liked: boolean;
            has_disliked: boolean;
            likes: number;
        };
    };
};

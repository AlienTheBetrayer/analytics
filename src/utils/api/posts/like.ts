import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import "server-only";

export const likePost = async ({
    id,
    user_id,
}: {
    id: string;
    user_id: string;
}) => {
    const { data: post, error: privacyError } = (await supabaseServer
        .from("posts")
        .select("user_id, privacy:post_privacy(likes)")
        .eq("id", id)
        .single()) as {
        data: { user_id: string; privacy: { likes: boolean } };
        error: PostgrestError | null;
    };

    if (privacyError) {
        throw privacyError;
    }

    if (post?.privacy?.likes === false && post?.user_id !== user_id) {
        throw "likes are disallowed";
    }

    const { count, error } = await supabaseServer
        .from("post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", id)
        .eq("user_id", user_id);

    if (error) {
        throw error;
    }

    // already exists - delete
    if (count) {
        const { error: likeError } = await supabaseServer
            .from("post_likes")
            .delete()
            .eq("user_id", user_id)
            .eq("post_id", id);

        if (likeError) {
            throw likeError;
        }
    } else {
        // doesn't exist - create
        const { error } = await supabaseServer
            .from("post_likes")
            .upsert(
                { post_id: id, user_id },
                { onConflict: "user_id,post_id" },
            );

        if (error) {
            throw error;
        }
    }

    return nextResponse({ success: true }, 200);
};

export const likeComment = async ({
    type,
    id,
    user_id,
}: {
    type?: string;
    id: string;
    user_id: string;
}) => {
    if (!(type && ["like", "dislike"].includes(type))) {
        throw "type is wrong";
    }

    const { count, error } = await supabaseServer
        .from("comment_likes")
        .select("*", { count: "exact", head: true })
        .eq("comment_id", id)
        .eq("user_id", user_id)
        .eq("like", type === "like");

    if (error) {
        throw error;
    }

    // already exists - delete
    if (count) {
        const { error: likeError } = await supabaseServer
            .from("comment_likes")
            .delete()
            .eq("user_id", user_id)
            .eq("comment_id", id);

        if (likeError) {
            throw likeError;
        }
    } else {
        // doesn't exist - create
        const { error } = await supabaseServer
            .from("comment_likes")
            .upsert(
                { comment_id: id, user_id, like: type === "like" },
                { onConflict: "user_id, comment_id" },
            );

        if (error) {
            throw error;
        }
    }

    return nextResponse({ success: true }, 200);
};

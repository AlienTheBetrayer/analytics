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
        console.error(privacyError);
        throw privacyError;
    }

    if (post?.privacy?.likes === false && post?.user_id !== user_id) {
        return nextResponse(
            { error: "Likes are not allowed by privacy settings." },
            400,
        );
    }

    const { count, error } = await supabaseServer
        .from("post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", id)
        .eq("user_id", user_id);

    if (error) {
        console.error(error);
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
            console.error(likeError);
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
            console.error(error);
            return nextResponse({ error }, 400);
        }
    }

    return nextResponse(
        {
            message: "Successfully liked/unliked!",
        },
        200,
    );
};

export const likeComment = async ({
    type,
    id,
    user_id,
}: {
    type?: string;
    id: string;
    user_id: string;
}) => {};

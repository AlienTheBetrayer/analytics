import { supabaseServer } from "@/server/private/supabase";
import { Comment } from "@/types/tables/posts";
import { nextResponse } from "@/utils/api/response";
import { tokenPayload } from "@/utils/auth/tokenPayload";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const post_id = searchParams.get("post_id");
        const comment_id = searchParams.get("comment_id");

        const caller_id = tokenPayload(request)?.refreshToken?.id;

        if (!post_id && !comment_id) {
            throw "post_id and comment_id are undefined";
        }

        const { data, error } = (await supabaseServer
            .from("comments")
            .select(
                `
                        *,
                        has_liked:comment_likes!left(id),
                        has_disliked:comment_likes!left(id),
                        likes:comment_likes(count)
                    `,
            )
            .eq(post_id ? "post_id" : "id", post_id || comment_id)
            // likes
            .eq(
                "has_liked.user_id",
                caller_id ?? "00000000-0000-0000-0000-000000000000",
            )
            .eq("has_liked.like", true)
            // dislikes
            .eq(
                "has_disliked.user_id",
                caller_id ?? "00000000-0000-0000-0000-000000000000",
            )
            .eq("has_disliked.like", false)
            // total likes
            .eq("likes.like", true)
            // sorting
            .order("edited_at", { ascending: false, nullsFirst: false })
            .order("created_at", { ascending: false })) as {
            data: (Comment & {
                has_liked: string[];
                has_disliked: string[];
                likes: { count: number }[];
            })[];
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        return nextResponse({
            success: true,
            comments: data.map((d) => ({
                ...d,
                has_liked: d.has_liked?.length,
                has_disliked: d.has_disliked?.length,
                likes: d.likes?.[0].count,
            })),
        });
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

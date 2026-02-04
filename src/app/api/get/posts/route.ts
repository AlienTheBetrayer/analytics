import { supabaseServer } from "@/server/private/supabase";
import { Post } from "@/types/tables/posts";
import { nextResponse } from "@/utils/api/response";
import { tokenPayload } from "@/utils/auth/tokenPayload";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const post_ids = searchParams.get("post_ids")?.split(",");
        const user_ids = searchParams.get("user_ids")?.split(",");

        const caller_id = tokenPayload(request)?.refreshToken?.id;

        if (!(post_ids || user_ids)) {
            throw "post_ids and user_ids are undefined";
        }

        // all posts from user ids
        const { data, error } = (await supabaseServer
            .from("posts")
            .select("*, has_liked:post_likes(id), likes:post_likes(count)")
            .in(post_ids ? "id" : "user_id", (post_ids || user_ids)!)
            .eq(
                "has_liked.user_id",
                caller_id ?? "00000000-0000-0000-0000-000000000000",
            )) as {
            data: (Post & {
                has_liked: string[];
                likes: { count: number }[];
            })[];
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        return nextResponse(
            {
                success: true,
                posts: data.map((d) => ({
                    ...d,
                    has_liked: d.has_liked?.length,
                    likes: d.likes?.[0]?.count,
                })),
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

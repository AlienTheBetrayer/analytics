import { supabaseServer } from "@/server/private/supabase";
import { PostPrivacy } from "@/types/tables/posts";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const post_ids = searchParams.get("post_ids")?.split(",");

        if (!post_ids?.length) {
            throw "post_ids is undefined";
        }

        const { data, error } = (await supabaseServer
            .from("post_privacy")
            .select()
            .in("post_id", post_ids)) as {
            data: PostPrivacy[];
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        return nextResponse({ success: true, privacy: data });
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

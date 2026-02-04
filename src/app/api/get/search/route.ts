import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { getPagination } from "@/utils/other/paginatePage";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const query = searchParams.get("query");
        const page = searchParams.get("page") || "0";

        if (!query) {
            throw "Query is empty";
        }

        const { from, to } = getPagination(Number(page), 3);

        const { data, count, error } = (await supabaseServer
            .from("users")
            .select("id, posts:posts(id)", { count: "exact" })
            .ilike("username", `%${query}%`)
            .limit(3, { referencedTable: "posts" })
            .order("last_seen_at", { ascending: false })
            .range(from, to)) as {
            data: { id: string; posts: { id: string }[] }[];
            error: PostgrestError | null;
            count: number;
        };

        if (error) {
            throw error;
        }

        return nextResponse(
            {
                success: true,
                ids: data.map((d) => ({
                    id: d.id,
                    post_ids: d.posts.map((p) => p.id),
                })),
                pages: count,
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

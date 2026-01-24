import { supabaseServer } from "@/server/private/supabase";
import { Profile, User } from "@/types/tables/account";
import { Post } from "@/types/tables/posts";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    // params
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("query");

    if (!query) {
        console.error("[query] is empty.");
        return nextResponse({ error: "[query] is empty." }, 400);
    }

    try {
        const { data: profileData, error: profileError } = (await supabaseServer
            .from("users")
            .select("*, profile:profiles(*)")
            .ilike("username", query === "*" ? "%" : `%${query}%`)
            .order("last_seen_at", { ascending: false })) as {
            data: (User & { profile: Profile })[];
            error: PostgrestError | null;
        };

        const { data: postsData, error: postsError } = (await supabaseServer
            .from("posts")
            .select()
            .ilike("title", query === "*" ? "%" : `%${query}%`)
            .order("edited_at", {
                ascending: false,
                nullsFirst: false,
            })
            .order("created_at", {
                ascending: false,
            })) as {
            data: Post[];
            error: PostgrestError | null;
        };

        if (profileError) {
            console.error(profileError);
            return nextResponse(profileError, 400);
        }

        if (postsError) {
            console.error(postsError);
            return nextResponse(postsError, 400);
        }

        return nextResponse(
            {
                users: profileData.map(({ password, ...rest }) => ({
                    ...rest,
                })),
                posts: postsData,
            },
            200,
        );
    } catch (e) {
        console.error(e);
        return nextResponse({ error: "User search has failed." }, 400);
    }
};

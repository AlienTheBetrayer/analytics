import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const conversation_id = searchParams.get("conversation_id");

        if (!conversation_id) {
            throw "conversation_id is undefined";
        }

        const { data, error } = await supabaseServer
            .from("conversation_members")
            .select(
                `conversation_id, created_at, 
                        user:users(id, username, last_seen_at, 
                        profile:profiles(avatar_url, color))`,
            )
            .eq("conversation_id", conversation_id)
            .order("user(last_seen_at)", {
                ascending: false,
                nullsFirst: false,
            });

        console.log(data);

        if (error) {
            throw error;
        }

        return nextResponse({ success: true, members: data }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

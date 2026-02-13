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
            .from("conversations")
            .select(
                `*, 
                messages:messages(*, user:users(*, profile:profiles(*))), 
                conversation_members:conversation_members(*, user:users(*, profile:profiles(*)))`,
            )
            .eq("id", conversation_id);

        if (error) {
            throw error;
        }

        return nextResponse({ success: true, messages: data?.[0] }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

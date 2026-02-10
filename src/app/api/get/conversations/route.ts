import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const username = searchParams.get("username");

        if (!username) {
            throw "username is undefined";
        }

        const { data, error } = await supabaseServer
            .from("conversations")
            .select(
                "*, conversation_members:conversation_members!inner(*, user:users!inner(*, profile:profiles(*))), last_message:messages(*)",
            )
            .eq("conversation_members.user.username", username)
            .order("created_at", {
                referencedTable: "last_message",
                ascending: false,
            })
            .limit(1, { referencedTable: "last_message" });

        console.log(data);

        if (error) {
            throw error;
        }

        return nextResponse({ success: true, conversations: data }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

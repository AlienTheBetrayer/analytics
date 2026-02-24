import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenPayload } from "@/utils/auth/tokenPayload";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const conversation_id = searchParams.get("conversation_id");

        if (!conversation_id) {
            throw "conversation_id is undefined";
        }

        // permissions
        {
            const token = tokenPayload(request)?.accessToken;

            if (!token) {
                throw "unauthenticated.";
            }

            const { count, error } = await supabaseServer
                .from("conversation_members")
                .select("*", { head: true, count: "exact" })
                .eq("conversation_id", conversation_id)
                .eq("user_id", token?.id);

            if (error) {
                throw error;
            }

            if (!count) {
                throw "lacking permissions.";
            }
        }
        const { data, error } = await supabaseServer
            .from("messages")
            .select("*, user:users(*, profile:profiles(*))")
            .eq("conversation_id", conversation_id);

        if (error) {
            throw error;
        }

        return nextResponse({ success: true, messages: data }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

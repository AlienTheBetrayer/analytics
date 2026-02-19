import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { message_id, user_id } = await request.json();

        if (!message_id || !user_id) {
            throw "message_id and user_id are undefined";
        }

        tokenVerify({ request, id: [user_id] });

        const { error } = await supabaseServer
            .from("messages")
            .delete()
            .eq("id", message_id)
            .eq("user_id", user_id);

        if (error) {
            throw error;
        }

        return nextResponse({ success: true }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

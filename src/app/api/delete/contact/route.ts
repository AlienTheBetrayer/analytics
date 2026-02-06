import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { user_id, message_id } = await request.json();

        if (!user_id || !message_id) {
            throw "user_id and message_id are undefined";
        }

        tokenVerify({ request, id: [user_id] });

        const { data, error } = await supabaseServer
            .from("contact_messages")
            .delete()
            .eq("id", message_id)
            .select();

        if (error) {
            throw error;
        }

        return nextResponse({ success: true, message: data });
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

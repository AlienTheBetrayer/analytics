import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";

export const POST = async (request: NextRequest) => {
    try {
        const { user_id, session_ids } = await request.json();

        if (!user_id || !session_ids?.length) {
            throw "user_id and session_ids are missing";
        }

        tokenVerify({ request, id: [user_id] });

        const { error } = await supabaseServer
            .from("tokens")
            .delete()
            .eq("user_id", user_id)
            .in("id", session_ids);

        if (error) {
            throw error;
        }

        return nextResponse({ success: true }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

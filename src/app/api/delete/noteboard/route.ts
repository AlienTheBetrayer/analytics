import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { user_id, noteboard_id } = await request.json();

        if (!user_id || !noteboard_id) {
            throw "user_id and noteboard_id are undefined";
        }

        tokenVerify({ request, id: [user_id] });

        const { error } = await supabaseServer
            .from("noteboards")
            .delete()
            .eq("id", noteboard_id);

        if (error) {
            throw error;
        }

        return nextResponse({ success: true }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

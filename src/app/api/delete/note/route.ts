import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { user_id, element_id } = await request.json();

        if (!user_id || !element_id) {
            throw "user_id and element_id are undefined";
        }

        tokenVerify({ request, id: [user_id] });

        const { error } = await supabaseServer
            .from("noteboard_elements")
            .delete()
            .eq("id", element_id);

        if (error) {
            throw error;
        }

        return nextResponse({ success: true }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

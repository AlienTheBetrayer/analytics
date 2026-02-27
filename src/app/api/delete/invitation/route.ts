import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { user_id, invitation_id } = await request.json();

        if (!user_id || !invitation_id) {
            throw "user_id and invitation_id are undefined";
        }

        tokenVerify({ request, id: [user_id] });

        const { error } = await supabaseServer
            .from("invitations")
            .delete()
            .eq("id", invitation_id);

        if (error) {
            throw error;
        }

        return nextResponse({ success: true }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

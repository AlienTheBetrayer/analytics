import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";

export const POST = async (request: NextRequest) => {
    try {
        const { user_id, ids } = await request.json();

        if (!user_id || !ids?.length) {
            console.error("user_id and ids[] are missing.");
            return nextResponse({ error: "user_id and ids[] are missing." });
        }

        tokenVerify(request, [user_id]);

        const { error } = await supabaseServer
            .from("tokens")
            .delete()
            .eq("user_id", user_id)
            .in("id", ids);

        if (error) {
            console.error(error);
            return nextResponse(error, 400);
        }

        return nextResponse(
            { message: "Successfully terminated sessions!" },
            200
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ error: "Failed terminatingsessions." }, 400);
    }
};

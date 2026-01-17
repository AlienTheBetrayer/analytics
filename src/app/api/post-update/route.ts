import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { user_id, id, ...rest } = await request.json();

        tokenVerify(request, [user_id]);

        const { error } = await supabaseServer
            .from("posts")
            .upsert({ id, ...rest }, { onConflict: "id" });

        if (error) {
            console.error(error);
            return nextResponse(error, 400);
        }

        return nextResponse({ message: "Successfully updated the post!" }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ error: "Failed updating the post." }, 400);
    }
};

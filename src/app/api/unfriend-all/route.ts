import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/response";
import { tokenVerify } from "@/utils/tokenVerify";

export const POST = async (request: NextRequest) => {
    try {
        const { id } = await request.json();

        if (id === undefined) {
            return nextResponse({ error: "id is missing." }, 400);
        }

        tokenVerify(request, id);

        const { error: unfriendError } = await supabaseServer
            .from("friends")
            .delete()
            .or(`user1_id.eq.${id},user2_id.eq.${id}`);

        if (unfriendError) {
            return nextResponse(unfriendError, 400);
        }

        return nextResponse({ message: "Successfully unfriended everyone!" }, 200);
    } catch {
        return nextResponse({ error: "Unfriending has failed." }, 400);
    }
};

import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/response";
import { tokenVerify } from "@/utils/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { id, role } = await request.json();

        if (!id || !role) {
            return nextResponse({ error: "id and role are missing." }, 400);
        }

        tokenVerify(request, undefined, "op");

        const { error } = await supabaseServer.from("users").update({ role }).eq("id", id);

        if (error) {
            return nextResponse({ error }, 400);
        }

        return nextResponse({ message: "Successfully changed the user's role." }, 200);
    } catch {
        return nextResponse({ error: "Failed changing user's role." }, 400);
    }
};

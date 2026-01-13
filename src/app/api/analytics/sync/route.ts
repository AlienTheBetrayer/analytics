import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        tokenVerify(request);

        const { data, error } = await supabaseServer
            .from("projects")
            .select("*, events:events(*)");

        if (error) {
            console.error(error);
            return nextResponse(error, 400);
        }

        return nextResponse(data, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ error: "Failed syncing data." }, 400);
    }
};

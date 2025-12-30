import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/response";
import { NextRequest } from "next/server";

export const GET = async (_request: NextRequest) => {
    try {
        const { data, error } = await supabaseServer
            .from("analytics")
            .select("*, project:projects(*), event:analytics_meta(*)");

        if (error) {
            return nextResponse(error, 400);
        }

        return nextResponse(data, 200);
    } catch {
        return nextResponse({ error: "Failed syncing data." }, 400);
    }
};

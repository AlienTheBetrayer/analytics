import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { event_id } = (await request.json()) as {
            event_id: string | undefined;
        };

        if (!event_id) {
            throw "event_id is undefined";
        }

        tokenVerify({ request, role: "admin" });

        const { error } = await supabaseServer
            .from("events")
            .delete()
            .eq("id", event_id);

        if (error) {
            throw error;
        }

        return nextResponse({ success: true }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

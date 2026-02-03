import { supabaseServer } from "@/server/private/supabase";
import { Event } from "@/types/tables/project";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        tokenVerify({ request });

        const { searchParams } = request.nextUrl;
        const project_id = searchParams.get("project_id") as string | undefined;

        if (!project_id) {
            throw "id is undefined";
        }

        const { data, error } = (await supabaseServer
            .from("events")
            .select("*")
            .eq("project_id", project_id)) as {
            data: Event[];
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        return nextResponse(
            {
                success: true,
                events: Object.fromEntries(data.map((e) => [e.id, e])),
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

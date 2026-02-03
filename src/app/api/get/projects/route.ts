import { supabaseServer } from "@/server/private/supabase";
import { Project } from "@/types/tables/project";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        tokenVerify({ request });

        const { data, error } = (await supabaseServer
            .from("projects")
            .select("*, event_count:events(count)")) as {
            data: (Project & { event_count: { count: number }[] })[];
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        return nextResponse(
            {
                success: true,
                projects: Object.fromEntries(
                    data.map((p) => [
                        p.id,
                        { ...p, event_count: p.event_count[0]?.count ?? 0 },
                    ]),
                ),
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

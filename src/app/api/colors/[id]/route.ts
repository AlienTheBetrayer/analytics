import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import type { Color } from "@/types/api/database/colors";
import { nextResponse } from "@/utils/response";
import { tokenVerify } from "@/utils/tokenVerify";

export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) => {
    try {
        const { id } = await params;

        tokenVerify(request, id);

        const { data: colorsData, error: colorsError } = (await supabaseServer
            .from("colors")
            .select()
            .eq("user_id", id)) as { data: Color[]; error: PostgrestError | null };

        if (colorsError) {
            return nextResponse(colorsError, 400);
        }

        return nextResponse({ colors: colorsData }, 200);
    } catch {
        return nextResponse({ error: "Failed getting the colors." }, 400);
    }
};

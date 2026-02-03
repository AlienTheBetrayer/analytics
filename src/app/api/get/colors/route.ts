import { supabaseServer } from "@/server/private/supabase";
import { Color } from "@/types/tables/account";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const user_id = searchParams.get("user_id");

        if (!user_id) {
            throw "user_id is undefined";
        }

        const { data, error } = (await supabaseServer
            .from("colors")
            .select()
            .eq("user_id", user_id)) as {
            data: Color[];
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        return nextResponse({ success: true, colors: data });
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

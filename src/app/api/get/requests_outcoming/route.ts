import { supabaseServer } from "@/server/private/supabase";
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
            .from("friend_requests")
            .select("to_id")
            .eq("from_id", user_id)) as {
            data: { to_id: string }[];
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        return nextResponse({
            success: true,
            requests: data.map((d) => d.to_id),
        });
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

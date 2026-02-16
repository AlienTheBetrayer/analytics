import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const user_id = searchParams.get("user_id");

        if (!user_id) {
            throw "user_id is undefined";
        }

        const { data, error } = await supabaseServer
            .from("noteboards")
            .select(
                `
                    id, title, description, pinned, pinned_at, edited_at, created_at
                    elements:noteboard_elements(id, title, checked, pinned, pinned_at, edited_at, created_at)
                `,
            )
            .eq("user_id", user_id);

        if (error) {
            throw error;
        }

        return nextResponse({ success: true, noteboards: data }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

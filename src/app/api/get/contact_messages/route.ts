import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenPayload } from "@/utils/auth/tokenPayload";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const user_id = searchParams.get("user_id");
        const accessPayload = tokenPayload(request)?.accessToken;

        let data: { id: string }[];
        let error: PostgrestError | null;

        if (user_id) {
            ({ data, error } = (await supabaseServer
                .from("contact_messages")
                .select("id")
                .eq("user_id", user_id)
                .order("created_at", { ascending: false })) as {
                data: { id: string }[];
                error: PostgrestError | null;
            });
        } else {
            if (accessPayload?.role === "user") {
                throw "user_id is undefined";
            }

            ({ data, error } = (await supabaseServer
                .from("contact_messages")
                .select("id")
                .order("created_at", { ascending: false })) as {
                data: { id: string }[];
                error: PostgrestError | null;
            });
        }

        if (error) {
            throw error;
        }

        return nextResponse({ success: true, ids: data.map((d) => d.id) }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

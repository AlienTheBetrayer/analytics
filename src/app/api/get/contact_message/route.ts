import { supabaseServer } from "@/server/private/supabase";
import { ContactMessage } from "@/types/tables/contact";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const message_ids = searchParams.get("message_ids")?.split(",");

        if (!message_ids?.length) {
            throw "message_ids are undefined";
        }

        const { data, error } = (await supabaseServer
            .from("contact_messages")
            .select()
            .in("id", message_ids)) as {
            data: ContactMessage[];
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        return nextResponse({ success: true, messages: data }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

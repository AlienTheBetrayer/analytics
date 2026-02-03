import { supabaseServer } from "@/server/private/supabase";
import { Friend } from "@/types/tables/account";
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
            .from("friends")
            .select()
            .or(`user1_id.eq.${user_id},user2_id.eq.${user_id}`)) as {
            data: Friend[];
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        return nextResponse(
            {
                success: true,
                friends: data.map((d) =>
                    d.user1_id === user_id ? d.user2_id : d.user1_id,
                ),
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

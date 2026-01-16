import { supabaseServer } from "@/server/private/supabase";
import { Profile, User } from "@/types/tables/account";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    // params
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("query");

    if (!query) {
        console.error("[query] is empty.");
        return nextResponse({ error: "[query] is empty." }, 400);
    }

    try {
        const { data, error } = (await supabaseServer
            .from("users")
            .select("*, profile:profiles(*)")
            .ilike("username", query === "*" ? "%" : `%${query}%`)) as {
            data: (User & { profile: Profile })[];
            error: PostgrestError | null;
        };

        if (error) {
            console.error(error);
            return nextResponse(error, 400);
        }

        return nextResponse(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            { users: data.map(({ password, ...rest }) => ({ ...rest })) },
            200
        );
    } catch (e) {
        console.error(e);
        return nextResponse({ error: "User search has failed." }, 400);
    }
};

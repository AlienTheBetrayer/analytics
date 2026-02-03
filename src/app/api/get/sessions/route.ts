import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenPayload } from "@/utils/auth/tokenPayload";
import { Token } from "@/types/tables/auth";

export const GET = async (request: NextRequest) => {
    try {
        // verifying args and permissions
        const { searchParams } = request.nextUrl;
        const user_id = searchParams.get("user_id");

        if (!user_id) {
            throw "user_id is missing";
        }

        const refreshToken = tokenPayload(request)?.refreshToken;

        const { data: sessionData, error } = (await supabaseServer
            .from("tokens")
            .select()
            .eq("user_id", user_id)) as {
            data: Token[];
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        const sessions = Object.fromEntries(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            sessionData.map(({ token, ...rest }) => [
                rest.session_id,
                {
                    ...rest,
                    is_current: rest.session_id === refreshToken?.session_id,
                },
            ]),
        );

        return nextResponse(
            {
                success: true,
                sessions,
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

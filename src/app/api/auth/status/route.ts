import { supabaseServer } from "@/server/private/supabase";
import { AuthenticationToken } from "@/types/auth/authentication";
import { Profile, User } from "@/types/tables/account";
import { nextResponse } from "@/utils/api/response";
import { tokenPayload } from "@/utils/auth/tokenPayload";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        // getting session from the payload (hence the current one)
        const refreshToken = tokenPayload(request)?.refreshToken;

        if (!refreshToken) {
            throw "Invalidated session.";
        }

        // updating the last seen timestamp
        const { data: userData, error: userError } = (await supabaseServer
            .from("users")
            .update({
                last_seen_at: new Date().toISOString(),
            })
            .eq("id", refreshToken.id)
            .select(
                "id, username, role, created_at, last_seen_at, profile:profiles(*)",
            )
            .single()) as {
            data: User & { profile: Profile };
            error: PostgrestError | null;
        };

        const { profile, ...user } = userData;

        if (userError) {
            throw userError;
        }

        const data: AuthenticationToken = {
            id: userData.id,
            role: userData.role,
            username: userData.username,
            session_id: refreshToken.session_id,
            profile,
            user,
        };

        return nextResponse({ success: true, status: data }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

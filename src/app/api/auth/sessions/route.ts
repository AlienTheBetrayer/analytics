import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenPayload } from "@/utils/auth/tokenPayload";
import { Token } from "@/types/tables/auth";
import { AuthenticationToken } from "@/types/auth/authentication";
import { User } from "@/types/tables/account";

export const GET = async (request: NextRequest) => {
    try {
        // verifying args and permissions
        const { searchParams } = request.nextUrl;
        const user_id = searchParams.get("user_id");
        const type =
            (searchParams.get("type") as "current" | "all" | null) ?? "all";

        switch (type) {
            case "all": {
                // verifying the user that's trying to get his sessions
                if (!user_id) {
                    console.error("user_id is missing.");
                    return nextResponse({ error: "user_id is missing." }, 400);
                }

                const refreshPayload = tokenPayload(request, "refresh");

                // getting all tokens of this user from db
                const { data: sessionData, error } = (await supabaseServer
                    .from("tokens")
                    .select()
                    .eq("user_id", user_id)) as {
                    data: Token[];
                    error: PostgrestError | null;
                };

                if (error) {
                    console.error(error);
                    return nextResponse(error, 400);
                }

                return nextResponse(
                    {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        sessions: sessionData.map(({ token, ...rest }) => ({
                            ...rest,
                            isCurrent: rest.session_id === refreshPayload?.refreshToken?.session_id
                        })),
                    },
                    200,
                );
            }
            case "current": {
                // getting session from the payload (hence the current one)
                const payload = tokenPayload(request, "refresh");

                if (!payload?.refreshToken) {
                    console.error("Invalidated session.");
                    return nextResponse({ error: "Invalidated session." }, 400);
                }

                // updating the last seen timestamp
                const { data: userData, error: userError } =
                    (await supabaseServer
                        .from("users")
                        .update({
                            last_seen_at: new Date().toISOString(),
                        })
                        .eq("id", payload.refreshToken.id)
                        .select()) as {
                        data: User[];
                        error: PostgrestError | null;
                    };

                if (userError) {
                    console.error(userError);
                    return nextResponse(userError, 400);
                }

                const data: AuthenticationToken = {
                    id: userData[0].id,
                    role: userData[0].role,
                    username: userData[0].username,
                    session_id: payload.refreshToken.session_id,
                };

                return nextResponse({ session: data }, 200);
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse(
            { error: "Failed getting the current sessions." },
            400,
        );
    }
};

import type { PostgrestError } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import type { Token } from "@/types/api/database/authentication";
import type { User } from "@/types/api/database/user";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (refreshToken === undefined) {
        return nextResponse({ error: "Session is outdated. Re-login." }, 400);
    }

    try {
        // if refresh token hasn't expired - issue a new access token
        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET as string
        ) as {
            id: string;
            role: string;
            session_id: string;
            username: string;
        };

        // get all server-side tokens from the current user
        const { data: refreshTokensData, error: refreshTokensError } =
            (await supabaseServer
                .from("tokens")
                .select()
                .eq("user_id", payload.id)) as {
                data: Token[];
                error: PostgrestError | null;
            };

        console.log(payload, refreshTokensData);
        if (refreshTokensError) {
            console.log("ERROR");
            return nextResponse(refreshTokensError, 400);
        }

        // detecting token substitution
        if (refreshTokensData.length === 0) {
            console.log("LENGTH");
            return nextResponse({ error: "Incorrect authentication." }, 400);
        }

        // align permissions
        const { data: userData, error: userError } = (await supabaseServer
            .from("users")
            .select()
            .eq("id", payload.id)) as {
            data: User[];
            error: PostgrestError | null;
        };

        if (userError) {
            return nextResponse(userError, 400);
        }

        if (userData.length === 0) {
            return nextResponse({ error: "The user does not exist." }, 400);
        }

        // if everything went right we issue the tokens
        const session_id = crypto.randomUUID();

        const accessToken = jwt.sign(
            {
                session_id,
                id: payload.id,
                role: userData[0].role,
                username: userData[0].username,
            },
            process.env.ACCESS_SECRET as string,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            {
                session_id,
                id: payload.id,
                role: userData[0].role,
                username: userData[0].username,
            },
            process.env.REFRESH_SECRET as string,
            { expiresIn: "7d" }
        );

        // replace the token from the database
        const { error: refreshDeleteError } = await supabaseServer
            .from("tokens")
            .delete()
            .eq("session_id", payload.session_id);

        if (refreshDeleteError) {
            console.log("dfsfsdfsdf");
            return nextResponse(refreshDeleteError, 400);
        }

        const { error: refreshRotateError } = await supabaseServer
            .from("tokens")
            .insert({
                user_id: payload.id,
                token: await bcrypt.hash(newRefreshToken, 10),
                session_id,
            });

        if (refreshRotateError) {
            console.log("penitia");

            return nextResponse(refreshRotateError, 400);
        }

        // updating last_seen_at
        const { error: lastSeenError } = await supabaseServer
            .from("users")
            .update({
                last_seen_at: new Date().toISOString(),
            })
            .eq("id", userData[0].id);

        if (lastSeenError) {
            console.log("doi tall over again");
            return nextResponse(lastSeenError, 400);
        }

        const response = nextResponse(
            { message: "Authenticated!", user: userData[0] },
            200,
            "user_refreshed"
        );

        response.cookies.set({
            name: "accessToken",
            value: accessToken,
            httpOnly: true,
            path: "/",
            maxAge: 15 * 60,
        });

        response.cookies.set({
            name: "refreshToken",
            value: newRefreshToken,
            httpOnly: true,
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;
    } catch {
        return nextResponse(
            { error: "Not authenticated" },
            401,
            "not_authenticated"
        );
    }
};

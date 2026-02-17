import type { PostgrestError } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { User } from "@/types/tables/account";
import { AuthenticationToken } from "@/types/auth/authentication";

export const POST = async (request: NextRequest) => {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (refreshToken === undefined) {
        throw "outdated session";
    }

    try {
        // if refresh token hasn't expired - issue a new access token
        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET as string,
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
                data: AuthenticationToken[];
                error: PostgrestError | null;
            };

        if (refreshTokensError) {
            throw refreshTokensError;
        }

        // detecting token substitution
        if (!refreshTokensData.length) {
            throw "no token found";
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
            throw userError;
        }

        if (!userData.length) {
            throw "user does not exist";
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
            { expiresIn: "1h" },
        );

        const newRefreshToken = jwt.sign(
            {
                session_id,
                id: payload.id,
                role: userData[0].role,
                username: userData[0].username,
            },
            process.env.REFRESH_SECRET as string,
            { expiresIn: "7d" },
        );

        // replace the token from the database
        const { error: refreshDeleteError } = await supabaseServer
            .from("tokens")
            .delete()
            .eq("session_id", payload.session_id);

        if (refreshDeleteError) {
            throw refreshDeleteError;
        }

        const { error: refreshRotateError } = await supabaseServer
            .from("tokens")
            .insert({
                user_id: payload.id,
                token: await bcrypt.hash(newRefreshToken, 10),
                session_id,
            });

        if (refreshRotateError) {
            throw refreshRotateError;
        }

        const response = nextResponse(
            { success: true, user: userData[0] },
            200,
        );

        response.cookies.set({
            name: "accessToken",
            value: accessToken,
            httpOnly: true,
            path: "/",
            maxAge: 1 * 60 * 60,
        });

        response.cookies.set({
            name: "refreshToken",
            value: newRefreshToken,
            httpOnly: true,
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 401);
    }
};

import type { PostgrestError } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { Profile, User } from "@/types/tables/account";

export const POST = async (request: NextRequest) => {
    try {
        // json body checking
        const { username, password } = await request.json();

        if (!username || !password) {
            throw "Username and password are undefined";
        }

        // user checking
        const { data: userData, error: userError } = (await supabaseServer
            .from("users")
            .select(`*, profile:profiles(*)`)
            .eq("username", username)) as {
            data: (User & { profile: Profile })[];
            error: PostgrestError | null;
        };

        if (userError) {
            throw userError;
        }

        if (!userData.length) {
            throw "User does not exist";
        }

        // password comparing
        const isPasswordCorrect = await bcrypt.compare(
            password,
            userData[0].password!,
        );

        if (!isPasswordCorrect) {
            throw "Incorrect credentials";
        }

        // logged in
        // issuing tokens
        const session_id = crypto.randomUUID();

        const accessToken = jwt.sign(
            {
                session_id,
                id: userData[0].id,
                role: userData[0].role,
                username: userData[0].username,
            },
            process.env.ACCESS_SECRET as string,
            { expiresIn: "15m" },
        );

        const refreshToken = jwt.sign(
            {
                session_id,
                id: userData[0].id,
                role: userData[0].role,
                username: userData[0].username,
            },
            process.env.REFRESH_SECRET as string,
            { expiresIn: "7d" },
        );

        // http-only cookies
        const res = nextResponse(
            { success: true, message: "Successfully logged in!" },
            200,
        );

        res.cookies.set({
            name: "accessToken",
            value: accessToken,
            httpOnly: true,
            path: "/",
            maxAge: 15 * 60,
        });

        res.cookies.set({
            name: "refreshToken",
            value: refreshToken,
            httpOnly: true,
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        const { error: refreshError } = await supabaseServer
            .from("tokens")
            .insert({
                user_id: userData[0].id,
                token: await bcrypt.hash(refreshToken, 10),
                session_id,
            });

        if (refreshError) {
            throw refreshError;
        }

        return res;
    } catch (error) {
        console.error(error);
        return nextResponse(
            {
                success: false,
                message: typeof error === "string" ? error : "unknown",
            },
            400,
        );
    }
};

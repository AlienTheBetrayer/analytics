import type { PostgrestError } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { User } from "@/types/tables/account";

export const POST = async (request: NextRequest) => {
    try {
        const { username, password }: { username: string; password: string } =
            await request.json();

        if (username === undefined || password === undefined) {
            throw "Username and password are undefined";
        }

        if (username.trim().length < 5 || password.trim().length < 5) {
            throw "Username and password have to be longe than 5";
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: existingUserData, error: existingUserError } =
            await supabaseServer
                .from("users")
                .select()
                .eq("username", username);

        if (existingUserError) {
            throw existingUserError;
        }

        if (existingUserData.length > 0) {
            throw "User already exists";
        }

        const { data: userData, error: userError } = (await supabaseServer
            .from("users")
            .insert({
                username: username.trim().replaceAll(" ", "_"),
                password: hashedPassword,
            })
            .select()) as {
            data: User[];
            error: PostgrestError | null;
        };

        if (userError) {
            throw userError;
        }

        const { error: profileError } = await supabaseServer
            .from("profiles")
            .insert({ user_id: userData[0].id, name: userData[0].username })
            .select();

        if (profileError) {
            throw profileError;
        }

        return nextResponse(
            { success: true, message: "Successfully signed up!" },
            200,
        );
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

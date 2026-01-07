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
            return nextResponse(
                {
                    error: "username or password are missing.",
                },
                400
            );
        }

        if (username.trim().length < 5 || password.trim().length < 5) {
            return nextResponse(
                {
                    error: "username and password length has to be longer than 5.",
                },
                400
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: existingUserData, error: existingUserError } =
            await supabaseServer
                .from("users")
                .select()
                .eq("username", username);

        if (existingUserError) {
            console.error(existingUserError);
            return nextResponse(existingUserError, 400);
        }

        if (existingUserData.length > 0) {
            console.error("The user already exists.");
            return nextResponse(
                { error: "The user already exists." },
                400,
                "user_already_exists"
            );
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
            console.error(userError);
            return nextResponse(userError, 400);
        }

        const { error: profileError } = await supabaseServer
            .from("profiles")
            .insert({ user_id: userData[0].id, name: userData[0].username })
            .select();

        if (profileError) {
            console.error(profileError);
            return nextResponse(profileError, 400);
        }

        return nextResponse(
            { message: "Successfully created the user and profile!" },
            200,
            "user_registered"
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ error: "Failed to register" }, 400);
    }
};

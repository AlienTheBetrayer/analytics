import type { PostgrestError } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import type { NextRequest } from "next/server";
import type { User } from "@/types/api/database/user";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
	try {
		const { username, password }: { username: string; password: string } =
			await request.json();

		if (username === undefined || password === undefined) {
			return nextResponse(
				{
					error: "username or password are missing.",
				},
				400,
			);
		}

		if (username.trim().length < 5 || password.trim().length < 5) {
			return nextResponse(
				{ error: "username and password length has to be longer than 5." },
				400,
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const { data: existingUserData, error: existingUserError } =
			await supabaseServer.from("users").select().eq("username", username);

		if (existingUserError) {
			return nextResponse(existingUserError, 400);
		}

		if (existingUserData.length > 0) {
			return nextResponse({ error: "The user already exists." }, 400);
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
			return nextResponse(userError, 400);
		}

		const { error: profileError } = await supabaseServer
			.from("profiles")
			.insert({ user_id: userData[0].id, name: userData[0].username });

		if (profileError) {
			return nextResponse(profileError, 400);
		}

		return nextResponse(
			{ message: "Successfully created the user and profile! " },
			200,
			"user_registered",
		);
	} catch (e) {
		const message = e instanceof Error ? e.message : "unknown error";
		return nextResponse({ error: message }, 400);
	}
};

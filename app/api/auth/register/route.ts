import { nextResponse } from "@/app/utils/response";
import { supabaseServer } from "@/server/supabase";
import bcrypt from "bcrypt";
import type { NextRequest } from "next/server";

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

		const { data: userData, error: userError0 } = await supabaseServer
			.from("users")
			.select()
			.eq("username", username);

		if (userError0) {
			return nextResponse(userError0, 400);
		}

		if (userData.length > 0) {
			return nextResponse({ error: "The user already exists." }, 400);
		}

		const { error: userError } = await supabaseServer
			.from("users")
			.insert({ username: username.trim(), password: hashedPassword });

		if (userError) {
			return nextResponse(userError, 400);
		}

		return nextResponse({ message: "Successfully created the user! " }, 200);
	} catch (e) {
		const message = e instanceof Error ? e.message : "unknown error";
		return nextResponse({ error: message }, 400);
	}
};

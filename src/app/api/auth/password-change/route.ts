import bcrypt from "bcrypt";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
	try {
		const { id, password } = await request.json();

		if (id === undefined || password === undefined) {
			return nextResponse(
				{ error: "id or password are missing." },
				400,
				"fields_missing",
			);
		}

		const { data: userData, error: userError } = await supabaseServer
			.from("users")
			.select()
			.eq("id", id);

		if (userError) {
			return nextResponse(userError, 400);
		}

		if (userData.length === 0) {
			return nextResponse({ error: "User hasn't been created yet." }, 400);
		}

		if (password.trim().length < 5) {
			return nextResponse(
				{ error: "username and password length has to be longer than 5." },
				400,
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const { error: changeError } = await supabaseServer
			.from("users")
			.update({ password: hashedPassword })
			.eq("id", id);

		if (changeError) {
			return nextResponse(changeError, 400);
		}

		return nextResponse({ message: "Successfully changed the password!" }, 200);
	} catch {
		return nextResponse({ error: "Password changing has failed." }, 400);
	}
};

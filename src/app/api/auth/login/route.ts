import type { PostgrestError } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import type { User } from "@/types/api/database/user";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
	try {
		// json body checking
		const { username, password } = await request.json();

		if (username === undefined || password === undefined) {
			return nextResponse(
				{ error: "username or password are missing." },
				400,
				"fields_missing",
			);
		}

		// user checking
		const { data: userData, error: userError } = (await supabaseServer
			.from("users")
			.select()
			.eq("username", username)) as {
			data: User[];
			error: PostgrestError | null;
		};

		if (userError) {
			return nextResponse(userError, 400);
		}

		if (userData.length === 0) {
			return nextResponse(
				{ error: "The user has not been created yet." },
				400,
				"user_not_exists",
			);
		}

		// password comparing
		const isPasswordCorrect = await bcrypt.compare(
			password,
			userData[0].password,
		);

		if (isPasswordCorrect === false) {
			return nextResponse({ error: "Invalid credentials" }, 401);
		}

		// logged in
		// issuing tokens
		const accessToken = jwt.sign(
			{ id: userData[0].id, role: userData[0].role },
			process.env.ACCESS_SECRET as string,
			{ expiresIn: "15m" },
		);

		const refreshToken = jwt.sign(
			{ id: userData[0].id, role: userData[0].role },
			process.env.REFRESH_SECRET as string,
			{ expiresIn: "7d" },
		);

		// http-only cookies
		const res = nextResponse(
			{ message: "Authenticated!", user: userData[0] },
			200,
			"user_logged_in",
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

		const { error: refreshError } = await supabaseServer.from("tokens").insert({
			user_id: userData[0].id,
			token: await bcrypt.hash(refreshToken, 10),
		});

		if (refreshError) {
			return nextResponse(refreshError, 400);
		}

		return res;
	} catch (e) {
		const message = e instanceof Error ? e.message : "unknown error";
		return nextResponse({ error: message }, 400);
	}
};

import type { TokensType } from "@/app/types/database";
import { nextResponse } from "@/app/utils/response";
import { supabaseServer } from "@/server/supabase";
import type { PostgrestError } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
	const refreshToken = request.cookies.get("refreshToken")?.value;

	if (refreshToken === undefined) {
		return nextResponse({ error: "Session is outdated. Re-login." }, 400);
	}

	try {
		// if refresh token hasn't expired - issue a new access token
		const payload = jwt.verify(
			refreshToken,
			process.env.REFRESH_SECRET as string,
		) as { id: string; role: string };

		// get all server-side tokens from the current user
		const { data: refreshTokensData, error: refreshTokensError } =
			(await supabaseServer
				.from("tokens")
				.select()
				.eq("user_id", payload.id)) as {
				data: TokensType[];
				error: PostgrestError | null;
			};

		if (refreshTokensError) {
			return nextResponse(refreshTokensError, 400);
		}

		// detecting token substitution
		if (refreshTokensData.length === 0) {
			return nextResponse({ error: "Incorrect authentication." }, 400);
		}

		// compare all the hashes to detect a theft
		const results = await Promise.all(
			refreshTokensData.map(async (data) => ({
				id: data.id,
				matched: await bcrypt.compare(refreshToken, data.token),
			})),
		);

		const matchedToken = results.find((r) => r.matched) ?? false;

		if (matchedToken === false) {
			const response = NextResponse.json(
				{ error: "Token theft detection" },
				{ status: 400 },
			);

			response.cookies.delete("accessToken");
			response.cookies.delete("refreshToken");

			return response;
		}

		// if the token is matched in the database (as it should) - rotate everything and sign in
		const accessToken = jwt.sign(
			{ id: payload.id, role: payload.role },
			process.env.ACCESS_SECRET as string,
			{ expiresIn: "15m" },
		);

		const newRefreshToken = jwt.sign(
			{ id: payload.id, role: payload.role },
			process.env.REFRESH_SECRET as string,
			{ expiresIn: "30d" },
		);

		const { error: refreshDeleteError } = await supabaseServer
			.from("tokens")
			.delete()
			.eq("id", matchedToken.id);

		if (refreshDeleteError) {
			return nextResponse(refreshDeleteError, 400);
		}

		const { error: refreshRotateError } = await supabaseServer
			.from("tokens")
			.insert({ user_id: payload.id, token: await bcrypt.hash(newRefreshToken, 10) });

		if (refreshRotateError) {
			return nextResponse(refreshRotateError, 400);
		}

		const response = NextResponse.json(
			{ message: "Re-Authenticated" },
			{ status: 200 },
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
			maxAge: 30 * 24 * 60 * 60,
		});

		return response;
	} catch {
		return nextResponse({ error: "Not authenticated" }, 401);
	}
};

import { nextResponse } from "@/app/utils/response";
import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
	const refreshToken = request.cookies.get("refreshToken");

	if (refreshToken === undefined) {
		return nextResponse({ error: "Session is outdated. Re-login. " }, 400);
	}

	try {
		// if refresh token hasn't expired - issue a new access token
		jwt.verify(refreshToken.value, process.env.REFRESH_SECRET as string);

		const accessToken = jwt.sign(
			{ type: "access_code" },
			process.env.ACCESS_SECRET as string,
			{ expiresIn: "15m" },
		);

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

		return response;
	} catch (error) {
		const message = error instanceof Error ? error.message : "jwt error";
		return nextResponse({ error: message }, 400);
	}
};

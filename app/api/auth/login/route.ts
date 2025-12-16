import { nextResponse } from "@/utils/request";
import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
	try {
		const { code } = await request.json();

		if (code === undefined) {
			return nextResponse({ error: "code is missing." }, 400);
		}

		// password checking
		if (code !== (process.env.CODE as string)) {
			console.log(process.env.CODE as string);
			return nextResponse({ error: "code is incorrect." }, 401);
		}

		// issuing tokens
		const accessToken = jwt.sign(
			{ type: "access_code" },
			process.env.ACCESS_SECRET as string,
			{ expiresIn: "15m" },
		);
		const refreshToken = jwt.sign(
			{ type: "access_code" },
			process.env.REFRESH_SECRET as string,
			{ expiresIn: "30d" },
		);

		// http-only cookies
		const res = NextResponse.json(
			{ message: "Authenticated!" },
			{ status: 200 },
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
			maxAge: 30 * 24 * 60 * 60,
		});

		return res;
	} catch (e) {
		const message = e instanceof Error ? e.message : "unknown error";
		return nextResponse({ error: message }, 400);
	}
};

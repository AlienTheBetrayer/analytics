import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import { nextResponse } from "./app/utils/response";

export const proxy = async (request: NextRequest) => {
	const token = request.cookies.get("accessToken");

	if (token === undefined) {
		return nextResponse({ error: "Unauthorized" }, 400);
	}

	try {
		const payload = jwt.verify(
			token.value,
			process.env.ACCESS_SECRET as string,
		) as {
			userId: string;
			role: "user" | "admin";
		};

		if (payload.role === "admin") {
			return NextResponse.next();
		}

		if (request.nextUrl.pathname.startsWith("/api/analytics/user")) {
			if (payload.role === "user") {
                console.log('allowed');
				return NextResponse.next();
			}
		}

		if (request.nextUrl.pathname.startsWith("/api/analytics/admin")) {
			if (payload.role !== "user") {
				return NextResponse.next();
			}
		}

		return NextResponse.json(
			{ error: "Not enough permissions" },
			{ status: 401 },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "jwt error";
		return nextResponse({ error: message }, 401);
	}
};

export const config = {
	matcher: ["/api/analytics/user/:path*", "/api/analytics/admin/:path*"],
};

import { nextResponse } from "@/app/utils/response";
import { supabaseServer } from "@/server/supabase";
import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
	const refreshToken = request.cookies.get("refreshToken")?.value;

	if (refreshToken === undefined) {
		return nextResponse({ error: "Not logged in." }, 400);
	}

	try {
		const payload = jwt.verify(
			refreshToken,
			process.env.REFRESH_SECRET as string,
		) as { id: string; role: string };

		const { error: refreshError } = await supabaseServer
			.from("tokens")
			.delete()
			.eq("user_id", payload.id);

		if (refreshError) {
			return nextResponse(refreshError, 400);
		}

		const response = NextResponse.json(
			{ message: "Logged out. " },
			{ status: 200 },
		);

		response.cookies.delete("accessToken");
		response.cookies.delete("refreshToken");

		return response;
	} catch {
		return nextResponse({ error: "Not authenticated" }, 401);
	}
};

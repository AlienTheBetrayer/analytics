import { nextResponse } from "@/app/utils/response";
import { supabaseServer } from "@/server/supabase";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
	const refreshToken = request.cookies.get("refreshToken")?.value;

	if (refreshToken === undefined) {
		throw nextResponse({ error: "Not logged in." }, 400);
	}

	const { error: refreshError } = await supabaseServer
		.from("refresh_tokens")
		.delete()
		.neq("token", "");

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
};

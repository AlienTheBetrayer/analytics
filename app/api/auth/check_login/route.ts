import { nextResponse } from "@/app/utils/response";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
	const cookies = request.cookies;
	const accessToken = cookies.get("accessToken")?.value;
	const refreshToken = cookies.get("refreshToken")?.value;

	let isAccessValid = false;
	let isRefreshValid = false;

	if (accessToken !== undefined) {
		try {
			jwt.verify(accessToken, process.env.ACCESS_SECRET as string);
			isAccessValid = true;
		} catch {}
	}

	if (refreshToken !== undefined) {
		try {
			jwt.verify(refreshToken, process.env.REFRESH_SECRET as string);
			isRefreshValid = true;
		} catch {}
	}

	return nextResponse(
		{
			accessToken: isAccessValid,
			refreshToken: isRefreshValid,
		},
		200,
	);
};

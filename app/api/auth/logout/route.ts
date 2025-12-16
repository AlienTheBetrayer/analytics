import { NextResponse } from "next/server";

export const POST = async () => {
	const response = NextResponse.json(
		{ message: "Logged out. " },
		{ status: 200 },
	);

	response.cookies.delete("accessToken");
	response.cookies.delete("refreshToken");

	return response;
};

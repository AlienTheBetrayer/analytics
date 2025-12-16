import { type NextRequest, NextResponse } from "next/server";

export const proxy = async (request: NextRequest) => {
	const _route = request.nextUrl.pathname;

	return NextResponse.next();
};

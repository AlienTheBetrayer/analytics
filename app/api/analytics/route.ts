import { nextResponse } from "@/utils/request";
import type { NextRequest } from "next/server";
import { create } from "./post/create";
import { wipe } from "./post/wipe";

export type AnalyticsPostType = null | "create" | "wipe";

export const POST = async (request: NextRequest) => {
	const params = request.nextUrl.searchParams;
	const type = params.get("type") as AnalyticsPostType;

	switch (type) {
		case "create":
		case null:
			return await create(request);

		case "wipe":
			return await wipe();

		default:
			return nextResponse({ error: "supported types: create/wipe" }, 400);
	}
};

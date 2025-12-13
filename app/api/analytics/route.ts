import { nextResponse } from "@/utils/request";
import type { NextRequest } from "next/server";
import { projects } from "./get/projects";
import { create } from "./post/create";
import { wipe } from "./post/wipe";
import { project } from "./get/project";

export type AnalyticsPostType = null | "create" | "wipe";

export const POST = async (request: NextRequest) => {
	const params = request.nextUrl.searchParams;
	const type = params.get("type") as AnalyticsPostType;

	switch (type) {
		case "create":
			return await create(request);

		case "wipe":
			return await wipe();

		default:
			return nextResponse({ error: "supported types: create/wipe" }, 400);
	}
};

export const GET = async (request: NextRequest) => {
	const params = request.nextUrl.searchParams;
	const type = params.get("type");

	switch (type) {
		case "projects":
		case null:
			return await projects(request);

		case "project":
			return await project(request);

		default:
			return nextResponse({ error: "supported types: projects/" }, 400);
	}
};

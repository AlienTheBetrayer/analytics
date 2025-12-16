import { nextResponse } from "@/app/fetch/response";
import type { NextRequest } from "next/server";
import { project } from "./get/project";
import { projects } from "./get/projects";
import { create } from "./post/create";
import { delete_event } from "./protected/delete_event";
import { delete_events } from "./protected/delete_events";

export const POST = async (request: NextRequest) => {
	const params = request.nextUrl.searchParams;
	const type = params.get("type");

	switch (type) {
		case "create":
			return await create(request);

		case "delete_event":
			return await delete_event(request);

		case "delete_events":
			return await delete_events(request);

		default:
			return nextResponse(
				{ error: "supported types: create/wipe/delete_event/delete_events" },
				400,
			);
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

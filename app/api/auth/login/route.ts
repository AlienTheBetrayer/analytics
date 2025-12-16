import { nextResponse } from "@/utils/request";
import type { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
	try {
		const { code } = await request.json();

		if (code === undefined) {
			return nextResponse({ error: "code is missing." }, 400);
		}

		if (code !== (process.env.CODE as string)) {
			return nextResponse({ error: "code is incorrect." }, 401);
		}

        
	} catch (e) {
		const message = e instanceof Error ? e.message : "unknown error";
		return nextResponse({ error: message }, 400);
	}
};

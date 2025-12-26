import type { NextRequest } from "next/server";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

export const GET = async (
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	try {
		const id = (await params).id;

        const { data: sessionsData, error: sessionsError } = await supabaseServer
			.from("tokens")
			.select()
			.eq("user_id", id)
			.select("id");

		if (sessionsError) {
			return nextResponse(sessionsError, 400);
		}

		return nextResponse({ sessions: sessionsData }, 200);
	} catch {
		return nextResponse({ error: "Failed getting the current sessions." }, 400);
	}
};

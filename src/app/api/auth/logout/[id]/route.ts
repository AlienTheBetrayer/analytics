import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	try {
		const { id } = await params;

		const { error: logoutError } = await supabaseServer
			.from("tokens")
			.delete()
			.eq("id", id);

		if (logoutError) {
			return nextResponse(logoutError, 400);
		}

		return nextResponse({ message: "Successfully logged out a session." }, 200);
	} catch {
		return nextResponse({ error: "Failed logging out the session." }, 400);
	}
};

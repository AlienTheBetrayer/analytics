import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
	try {
		const { id } = await request.json();

		if (id === undefined) {
			return nextResponse({ error: "id is missing." }, 400);
		}

		const { error: deleteError } = await supabaseServer
			.from("users")
			.delete()
			.eq("id", id);

		if (deleteError) {
			return nextResponse(deleteError, 400);
		}

		return nextResponse({ message: "Successful account deletion." }, 200);
	} catch {
		return nextResponse({ error: "Account deletion has failed." }, 400);
	}
};

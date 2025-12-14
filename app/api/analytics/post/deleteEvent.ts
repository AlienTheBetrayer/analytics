import { supabaseServer } from "@/server/supabase";
import { nextResponse } from "@/utils/request";
import type { NextRequest } from "next/server";

export const deleteEvent = async (request: NextRequest) => {
	try {
		const { id } = await request.json();

		if (id === undefined) {
			return nextResponse({ error: "id is missing." }, 400);
		}

		const { error: analyticsError } = await supabaseServer
			.from("analytics")
			.delete()
			.is("analytics_meta_id", id);

		if (analyticsError) {
			return nextResponse(analyticsError, 400);
		}

		const { error: metaError } = await supabaseServer
			.from("analytics_meta")
			.delete()
			.is("id", id);

		if (metaError) {
			return nextResponse(metaError, 400);
		}
	} catch (e) {
		const message = e instanceof Error ? e.message : "unknown error";
		return nextResponse({ message }, 400);
	}
};

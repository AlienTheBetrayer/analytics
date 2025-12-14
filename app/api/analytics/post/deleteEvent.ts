import type { AnalyticsMetaType } from "@/app/types/database";
import { supabaseServer } from "@/server/supabase";
import { nextResponse } from "@/utils/request";
import type { PostgrestError } from "@supabase/supabase-js";
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
			.eq("analytics_meta_id", id);

		if (analyticsError) {
			return nextResponse(analyticsError, 400);
		}

		const { data: analyticsMetaData, error: metaError } = (await supabaseServer
			.from("analytics_meta")
			.delete()
			.eq("id", id)
			.select("*")
			.single()) as { data: AnalyticsMetaType; error: PostgrestError | null };

		if (metaError) {
			return nextResponse(metaError, 400);
		}

		return nextResponse(
			{
				message: `Successfully deleted ${analyticsMetaData.type} event!`,
			},
			200,
		);
	} catch (e) {
		const message = e instanceof Error ? e.message : "unknown error";
		return nextResponse({ message }, 400);
	}
};

import type { AnalyticsType } from "@/app/types/database";
import { supabaseServer } from "@/server/supabase";
import { nextResponse } from "@/utils/request";
import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

export const delete_events = async (request: NextRequest) => {
	try {
		const { project_id } = await request.json();

		if (project_id === undefined) {
			return nextResponse({ error: "project_id is missing." }, 400);
		}

		const { data: analyticsData, error: analyticsError } = (await supabaseServer
			.from("analytics")
			.select()
			.eq("project_id", project_id)) as {
			data: AnalyticsType[];
			error: PostgrestError | null;
		};

		if (analyticsError) {
			return nextResponse(analyticsError, 400);
		}

		const analyticsMetaIds = analyticsData.map(
			(data) => data.analytics_meta_id,
		);

		const { error: analyticsMetaError } = await supabaseServer
			.from("analytics_meta")
			.delete()
			.in("id", analyticsMetaIds);

		if (analyticsMetaError) {
			return nextResponse(analyticsMetaError, 400);
		}

		return nextResponse({ message: "Successfully deleted all events!" }, 200);
	} catch (e) {
		const message = e instanceof Error ? e.message : "unknown error";
		return nextResponse({ error: message }, 400);
	}
};

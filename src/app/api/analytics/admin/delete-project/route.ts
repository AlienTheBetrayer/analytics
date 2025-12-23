import type { Analytics } from "@/src/types/api/database";
import { supabaseServer } from "@/src/types/server/supabase";
import { nextResponse } from "@/src/utils/response";
import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
	try {
		const { project_id } = await request.json();

		if (project_id === undefined) {
			return nextResponse({ error: "project_id is missing." }, 400);
		}

		// 1. delete all analytic events related to the project (if any exist)
		const { data: analyticsData, error: analyticsError } = (await supabaseServer
			.from("analytics")
			.select()
			.eq("project_id", project_id)) as {
			data: Analytics[];
			error: PostgrestError | null;
		};

		if (analyticsError) {
			return nextResponse(analyticsError, 400);
		}

		if (analyticsData.length > 0) {
			const analyticsDataIDs = analyticsData.map((a) => a.analytics_meta_id);

			const { error: analyticsMetaError } = await supabaseServer
				.from("analytics_meta")
				.delete()
				.in("id", analyticsDataIDs);

			if (analyticsMetaError) {
				return nextResponse(analyticsMetaError, 400);
			}
		}

		const { error: projectError } = await supabaseServer
			.from("projects")
			.delete()
			.eq("id", project_id);

		if (projectError) {
			return nextResponse(projectError, 400);
		}

		return nextResponse(
			{ message: "Successfully deleted all data about this project!" },
			200,
		);
	} catch (e) {
		const message = e instanceof Error ? e.message : "unknown error";
		return nextResponse({ error: message }, 400);
	}
};

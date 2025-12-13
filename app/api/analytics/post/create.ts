import type { AnalyticsMetaType, ProjectType } from "@/app/types/database";
import { supabaseServer } from "@/server/supabase";
import { nextResponse } from "@/utils/request";
import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

export const create = async (request: NextRequest) => {
	try {
		const { project, event, description } = await request.json();

		if (project === undefined || event === undefined) {
			return nextResponse({ error: "project & event are missing." }, 400);
		}

		// 1. inserting a project if it's not created
		const { data: projectData, error: projectError } = (await supabaseServer
			.from("projects")
			.upsert({ name: project }, { onConflict: "name" })
			.select()) as { data: ProjectType[]; error: PostgrestError | null };

		if (projectError) {
			return nextResponse({ projectError }, 400);
		}

		// 2. inserting a new metadata
		const { data: analyticsMetaData, error: analyticsMetaError } =
			(await supabaseServer
				.from("analytics_meta")
				.upsert({ type: event, description })
				.select()) as {
				data: AnalyticsMetaType[];
				error: PostgrestError | null;
			};

		if (analyticsMetaError) {
			return nextResponse({ analyticsMetaError }, 400);
		}

		// 3. inserting a project aggregate if it's not created
		const { error: projectAggregatesError } = await supabaseServer
			.from("project_aggregates")
			.upsert(
				{
					id: projectData[0].id,
					analytics_meta_id: analyticsMetaData[0].id,
				},
				{ onConflict: "id" },
			);

		if (projectAggregatesError) {
			return nextResponse({ projectAggregatesError }, 400);
		}

		// 4. finalizing and creating the last analytics row
		const { error: analyticsError } = await supabaseServer
			.from("analytics")
			.upsert({
				project_id: projectData[0].id,
				analytics_meta_id: analyticsMetaData[0].id,
			});

		if (analyticsError) {
			return nextResponse({ analyticsError }, 400);
		}

		return nextResponse({ message: "Successfully created an event!" }, 200);
	} catch (e) {
		const message = e instanceof Error ? e.message : "unknown error";
		return nextResponse({ error: message }, 400);
	}
};

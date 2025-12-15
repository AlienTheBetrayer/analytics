import type {
	AnalyticsMetaType,
	ProjectAggregatesType,
	ProjectType,
} from "@/app/types/database";
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

		// 1. inserting / updating a project
		const { data: projectData, error: projectError } = (await supabaseServer
			.from("projects")
			.upsert({ name: project }, { onConflict: "name" })
			.select()) as { data: ProjectType[]; error: PostgrestError | null };

		if (projectError) {
			return nextResponse({ projectError }, 400);
		}

		// 2. inserting / updating new metadata
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

		// 3. inserting / updating a project aggregate
		const { data: projectAggregatesData, error: projectAggregatesError1 } =
			(await supabaseServer
				.from("project_aggregates")
				.select()
				.eq("id", projectData[0].id)) as {
				data: ProjectAggregatesType[] | null;
				error: PostgrestError | null;
			};

		if (projectAggregatesError1) {
			return nextResponse({ projectAggregatesError1 }, 400);
		}

		const { error: projectAggregatesError } = await supabaseServer
			.from("project_aggregates")
			.upsert(
				{
					id: projectData[0].id,
					analytics_meta_id: analyticsMetaData[0].id,
					visits:
						event === "page_view"
							? (projectAggregatesData?.[0].visits ?? 0) + 1
							: (projectAggregatesData?.[0].visits ?? 0),
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

import { supabaseServer } from "@/server/supabase";
import { nextResponse } from "@/utils/request";

const fakeid = "00000000-0000-0000-0000-000000000000";

export const wipe = async () => {
	const { error: analyticsError } = await supabaseServer
		.from("analytics")
		.delete()
		.neq("id", fakeid);

	if (analyticsError) {
		return nextResponse({ analyticsError }, 400);
	}

	const { error: analyticsMetaError } = await supabaseServer
		.from("analytics_meta")
		.delete()
		.neq("id", fakeid);

	if (analyticsMetaError) {
		return nextResponse({ analyticsMetaError }, 400);
	}

	const { error: projectsError } = await supabaseServer
		.from("projects")
		.delete()
		.neq("id", fakeid);

	if (projectsError) {
		return nextResponse({ projectsError }, 400);
	}

	const { error: projectAggregatesError } = await supabaseServer
		.from("project_aggregates")
		.delete()
		.neq("id", fakeid);

	if (projectAggregatesError) {
		return nextResponse({ projectAggregatesError }, 400);
	}

	return nextResponse(
		{ message: "Successfully wiped all rows in all tables!" },
		200,
	);
};

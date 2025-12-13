import type {
	AnalyticsMetaType,
	AnalyticsType,
	ProjectAggregatesType,
} from "@/app/types/database";
import { supabaseServer } from "@/server/supabase";
import { nextResponse } from "@/utils/request";
import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

export const project = async (request: NextRequest) => {
	const params = request.nextUrl.searchParams;
	const id = params.get("id");

	if (!id) {
		return nextResponse(
			{
				error: "id is undefined, pass an id param with the id of the project.",
			},
			400,
		);
	}

	const { data: aggregatesData, error: aggregatesError } = (await supabaseServer
		.from("project_aggregates")
		.select("*")
		.eq("id", id)
		.single()) as {
		data: ProjectAggregatesType;
		error: PostgrestError | null;
	};

	if (aggregatesError) {
		return nextResponse(aggregatesError, 400);
	}

	const { data: analyticsData, error: analyticsError } = (await supabaseServer
		.from("analytics")
		.select("*")
		.eq("project_id", id)) as {
		data: AnalyticsType[];
		error: PostgrestError | null;
	};

	if (analyticsError) {
		return nextResponse(analyticsError, 400);
	}

	const analyticsDataIDs = analyticsData.map((a) => a.analytics_meta_id);

	const { data: metaData, error: metaError } = (await supabaseServer
		.from("analytics_meta")
		.select("*")
		.in("id", analyticsDataIDs)) as {
		data: AnalyticsMetaType[];
		error: PostgrestError | null;
	};

	if (metaError) {
		return nextResponse(metaError, 400);
	}

	return nextResponse(
		{ id, aggregates: aggregatesData, metaData: metaData },
		200,
	);
};

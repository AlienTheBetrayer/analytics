import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import type { Analytics, AnalyticsMeta } from "@/types/api/database/analytics";
import type { ProjectAggregate } from "@/types/api/database/projects";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

type ParamsType = {
	params: Promise<{ id: string }>;
};

export const GET = async (_request: NextRequest, { params }: ParamsType) => {
	const { id } = await params;

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
		.select()
		.eq("id", id)) as {
		data: ProjectAggregate[];
		error: PostgrestError | null;
	};

	if (aggregatesError) {
		return nextResponse(aggregatesError, 400);
	}

	const { data: analyticsData, error: analyticsError } = (await supabaseServer
		.from("analytics")
		.select()
		.eq("project_id", id)) as {
		data: Analytics[];
		error: PostgrestError | null;
	};

	if (analyticsError) {
		return nextResponse(analyticsError, 400);
	}

	const analyticsDataIDs = analyticsData.map((a) => a.analytics_meta_id);

	const { data: metaData, error: metaError } = (await supabaseServer
		.from("analytics_meta")
		.select()
		.in("id", analyticsDataIDs)) as {
		data: AnalyticsMeta[];
		error: PostgrestError | null;
	};

	if (metaError) {
		return nextResponse(metaError, 400);
	}

	return nextResponse(
		{ id, aggregates: aggregatesData[0], metaData: metaData },
		200,
	);
};

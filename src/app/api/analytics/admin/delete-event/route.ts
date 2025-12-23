import type { AnalyticsMeta } from "@/src/types/api/database";
import { supabaseServer } from "@/src/types/server/supabase";
import { nextResponse } from "@/src/utils/response";
import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
	try {
		const { id } = await request.json();

		if (id === undefined) {
			return nextResponse({ error: "id is missing." }, 400);
		}

		const { data: analyticsMetaData, error: metaError } = (await supabaseServer
			.from("analytics_meta")
			.delete()
			.eq("id", id)
			.select()) as {
			data: AnalyticsMeta[];
			error: PostgrestError | null;
		};

		if (metaError) {
			return nextResponse(metaError, 400);
		}

		return nextResponse(
			{
				message: `Successfully deleted ${analyticsMetaData[0].type} event!`,
			},
			200,
		);
	} catch (e) {
		const message = e instanceof Error ? e.message : "unknown error";
		return nextResponse({ message }, 400);
	}
};

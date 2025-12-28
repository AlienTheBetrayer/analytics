import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import type { Colors } from "@/types/api/database/colors";
import { nextResponse } from "@/utils/response";

export const GET = async (
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	try {
		const { id } = await params;

		const { data: colorsData, error: colorsError } = (await supabaseServer
			.from("colors")
			.select()
			.eq("user_id", id)) as { data: Colors[]; error: PostgrestError | null };

		if (colorsError) {
			return nextResponse(colorsError, 400);
		}

		return nextResponse({ colors: colorsData }, 200);
	} catch {
		return nextResponse({ error: "Failed getting the colors." }, 400);
	}
};

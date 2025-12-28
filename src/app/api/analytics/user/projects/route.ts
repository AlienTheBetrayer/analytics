import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/response";

export const GET = async (_request: NextRequest) => {
	const { data, error } = await supabaseServer.from("projects").select();

	if (error) {
		return nextResponse(error, 400);
	}

	return nextResponse(data, 200);
};

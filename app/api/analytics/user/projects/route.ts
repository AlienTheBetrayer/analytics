import { nextResponse } from "@/app/utils/response";
import { supabaseServer } from "@/server/supabase";
import type { NextRequest } from "next/server";

export const GET = async (_request: NextRequest) => {
	const { data, error } = await supabaseServer.from("projects").select();

	if (error) {
		return nextResponse(error, 400);
	}

	return nextResponse(data, 200);
};

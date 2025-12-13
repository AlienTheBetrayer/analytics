import { supabaseServer } from "@/server/supabase";
import { nextResponse } from "@/utils/request";
import type { NextRequest } from "next/server";

export const projects = async (_request: NextRequest) => {
	const { data, error } = await supabaseServer.from("projects").select("*");

	if (error) {
		return nextResponse(error, 400);
	}

	return nextResponse(data, 200);
};

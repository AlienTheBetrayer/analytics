import { supabaseServer } from "@/server/supabase";
import { nextResponse } from "@/utils/request";

export const GET = async () => {
	const { data } = await supabaseServer.from("analytics").select("*");

	return nextResponse({ message: "Success", data });
};

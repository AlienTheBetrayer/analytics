import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
	try {
		const {
			id,
			data,
		}: { id: string; data: { slot: number; color: string }[] } =
			await request.json();

		if (id === undefined || data === undefined) {
			return nextResponse({ error: "id and data are missing." }, 400);
		}

		const colorsData = data.map(({ slot, color }) => ({
			user_id: id,
			slot,
			color,
		}));

		const { error } = await supabaseServer
			.from("colors")
			.upsert(colorsData, { onConflict: "user_id,slot" });

		if (error) {
			return nextResponse(error, 400);
		}

		return nextResponse({ message: "Successfully stored the colors!" });
	} catch {
		return nextResponse({ error: "Failed saving the colors." }, 400);
	}
};

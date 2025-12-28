import type { NextRequest } from "next/server";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
	try {
		const { user1_id, user2_id } = await request.json();

		if (user1_id === undefined || user2_id === undefined) {
			return nextResponse({ error: "user1_id and user2_id are missing." }, 400);
		}

		const { error: requestError } = await supabaseServer
			.from("friend_requests")
			.delete()
			.or(
				`and(from_id.eq.${user1_id},to_id.eq.${user2_id}),and(from_id.eq.${user2_id},to_id.eq.${user1_id})`,
			);

		if (requestError) {
			return nextResponse(requestError, 400);
		}

		return nextResponse(
			{ message: "Successfully rejected both friend requests." },
			200,
		);
	} catch {
		return nextResponse({ error: "Request rejection has failed." }, 400);
	}
};

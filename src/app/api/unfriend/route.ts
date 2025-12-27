import type { NextRequest } from "next/server";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
	try {
		const { user1_id, user2_id } = await request.json();

		if (user1_id === undefined || user2_id) {
			return nextResponse({ error: "user1_id and user2_id are missing." }, 400);
		}

		const { error: unfriendError } = await supabaseServer
			.from("friends")
			.delete()
			.or(`and(user1_id.eq.${user1_id},user2_id.eq.${user2_id}),and(user1_id.eq.${user2_id},user2_id.eq.${user1_id})`);

        if(unfriendError) {
            return nextResponse(unfriendError, 400);
        }

        return nextResponse({ message: "Successfully unfriended the user!"}, 200);
	} catch {
		return nextResponse({ error: "Unfriending has failed." }, 400);
	}
};

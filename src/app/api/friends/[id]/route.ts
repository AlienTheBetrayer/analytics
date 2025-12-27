import type { NextRequest } from "next/server";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

export const GET = async (
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	try {
		const { id } = await params;

		const { data: friendsData, error: friendsError } = await supabaseServer
			.from("friends")
			.select()
			.or(`user1_id.eq.${id},user2_id.eq.${id}`);

            // "1 2"

            // "2 1"

            // "3 1"

            // 4 2

            // 2 4

        // new Set()

		if (friendsError) {
			return nextResponse(friendsError, 400);
		}

		return nextResponse({ friends: friendsData }, 200);
	} catch {
		return nextResponse({ error: "Failed getting a friend list." }, 400);
	}
};

import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
	try {
		const { from_id, to_id } = await request.json();

		if (from_id === undefined || to_id === undefined) {
			return nextResponse({ error: "from_id and to_id are missing." }, 400);
		}

		if (from_id === to_id) {
			return nextResponse(
				{ error: "you cannot send a friend request to yourself." },
				400,
			);
		}

		// checking if we're already friends - reject
		const { data: alreadyData, error: alreadyError } = await supabaseServer
			.from("friends")
			.select()
			.or(
				`user1_id.eq.${from_id},user2_id.eq.${to_id},user1_id.eq.${to_id},user2_id.eq.${from_id}`,
			)
			.limit(1);

		if (alreadyError) {
			return nextResponse(alreadyError, 400);
		}

		if (alreadyData.length > 0) {
			return nextResponse(
				{ error: "You are already friends with this user." },
				400,
				"friends_already",
			);
		}

		// checking if request had already been sent FROM us - reject
		const { data: fromRequestData, error: fromRequestError } =
			await supabaseServer
				.from("friend_requests")
				.select()
				.eq("from_id", from_id)
				.limit(1);

		if (fromRequestError) {
			return nextResponse(fromRequestError, 400);
		}

		if (fromRequestData.length > 0) {
			return nextResponse(
				{ error: "The friend request had already been sent." },
				400,
				"friend_request_already_sent",
			);
		}

		// checking if request had already been sent TO us - remove request & accept friendship
		const { data: toRequestData, error: toRequestError } = await supabaseServer
			.from("friend_requests")
			.select()
			.eq("to_id", from_id)
			.limit(1);

		if (toRequestError) {
			return nextResponse(toRequestError, 400);
		}

		if (toRequestData.length > 0) {
			const { error: acceptRequestError } = await supabaseServer
				.from("friend_requests")
				.delete()
				.eq("to_id", from_id);

			if (acceptRequestError) {
				return nextResponse(acceptRequestError, 400);
			}

			const { error: friendError } = await supabaseServer
				.from("friends")
				.insert({ user1_id: from_id, user2_id: to_id });

			if (friendError) {
				return nextResponse(friendError, 400);
			}

			return nextResponse(
				{ message: "Friend request accepted!" },
				200,
				"friend_request_accepted",
			);
		}

		const { error: sendRequestError } = await supabaseServer
			.from("friend_requests")
			.insert({ from_id, to_id });

		if (sendRequestError) {
			return nextResponse(sendRequestError, 400);
		}

		return nextResponse(
			{ message: "Friend request sent!" },
			200,
			"friend_request_sent",
		);
	} catch {
		return nextResponse({ error: "Failed sending a friend request." }, 400);
	}
};

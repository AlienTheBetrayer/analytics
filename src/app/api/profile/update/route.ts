import type { NextRequest } from "next/server";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
	try {
		const { user_id, status, oneliner, bio, visibility, name, color } =
			await request.json();

		if (user_id === undefined) {
			return nextResponse({ error: "user_id is missing." }, 400);
		}

		const { error: profileError } = await supabaseServer
			.from("profiles")
			.upsert(
				{
					name,
					user_id,
					status,
					oneliner,
					bio,
					visibility,
                    color,
				},
				{ onConflict: "user_id" },
			);

		if (profileError) {
			return nextResponse(profileError, 400);
		}

		return nextResponse(
			{ message: "Successfully updated the profile data!" },
			200,
		);
	} catch {
		return nextResponse({ error: "Profile updating has failed." }, 400);
	}
};

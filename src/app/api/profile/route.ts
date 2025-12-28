import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { nextResponse } from "@/utils/response";

export const GET = async (request: NextRequest) => {
	const params = request.nextUrl.searchParams;
	const id = params.get("id");
	const name = params.get("name");

	try {
		const { data: userData, error: userError } = (await supabaseServer
			.from("users")
			.select()
			.eq(id === null ? "username" : "id", id || name)) as {
			data: User[];
			error: PostgrestError | null;
		};

		if (userError) {
			return nextResponse(userError, 400);
		}

		if (userData.length === 0) {
			return nextResponse(
				{ error: "User has not been created yet." },
				400,
				"user_not_exists",
			);
		}

		const { data: profileData, error: profileError } = (await supabaseServer
			.from("profiles")
			.select()
			.eq("user_id", userData[0].id)) as {
			data: Profile[];
			error: PostgrestError | null;
		};

		if (profileError) {
			return nextResponse(profileError, 400);
		}

		if (profileData.length === 0) {
			return nextResponse(
				{ error: "User's profile has not been created yet." },
				400,
				"profile_not_exists",
			);
		}

		return nextResponse({ user: userData[0], profile: profileData[0] }, 200);
	} catch {
		return nextResponse({ error: "Failed fetching user's profile." }, 400);
	}
};

import type { PostgrestError, User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import type { Profile } from "@/types/api/database/profiles";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

export const GET = async (_request: NextRequest) => {
	try {
		const { data: userData, error: userError } = (await supabaseServer
			.from("users")
			.select()) as {
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
			.select()) as {
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
		return nextResponse({ error: "Failed getting all the profiles." }, 400);
	}
};

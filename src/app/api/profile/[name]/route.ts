import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

type ParamsType = {
	params: Promise<{ name: string }>;
};

export const GET = async (_request: NextRequest, { params }: ParamsType) => {
	const { name } = await params;

	try {
		const { data: userData, error: userError } = (await supabaseServer
			.from("users")
			.select()
			.eq("username", name)) as { data: User[]; error: PostgrestError | null };

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

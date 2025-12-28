import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
	try {
		const { ids } = await request.json();

		if (ids === undefined) {
			return nextResponse({ error: "ids are missing." }, 400);
		}

		const { data: profileData, error: profileError } = (await supabaseServer
			.from("profiles")
			.select("*, user:users (*)")
			.in("user_id", ids)) as {
			data: (Profile & { user?: User })[];
			error: PostgrestError | null;
		};

		if (profileError) {
			return nextResponse(profileError, 400);
		}

		const profilesData = profileData.map((data) => {
			const profilesOnly = { ...data };
			delete profilesOnly.user;
			return { profile: profilesOnly, user: data.user };
		});

		return nextResponse({ profiles: profilesData }, 200);
	} catch {
		return nextResponse({ error: "Failed getting all the profiles." }, 400);
	}
};

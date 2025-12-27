import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { supabaseServer } from "@/types/server/supabase";
import { nextResponse } from "@/utils/response";

export const GET = async (
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	try {
		const { id } = await params;

		const { data: friendsData, error: friendsError } = (await supabaseServer
			.from("friends")
			.select()
			.or(`user1_id.eq.${id},user2_id.eq.${id}`)) as {
			data: { id: string; user1_id: string; user2_id: string }[];
			error: PostgrestError | null;
		};

		if (friendsError) {
			return nextResponse(friendsError, 400);
		}

		const friends = friendsData.map((f) =>
			f.user1_id === id ? f.user2_id : f.user1_id,
		);

		const { data: profileData, error: profileError } = (await supabaseServer
			.from("profiles")
			.select("*, user:users (*)")
			.in("user_id", friends)) as {
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
		return nextResponse({ error: "Failed getting friends' profiles." }, 400);
	}
};

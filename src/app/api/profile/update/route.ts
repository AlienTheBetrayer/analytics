import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/response";

export const POST = async (request: NextRequest) => {
	try {
		const {
			user_id,
			status,
			oneliner,
			bio,
			visibility,
			name,
			color,
			avatar,
			avatar_name,
			avatar_type,
		} = await request.json();

		if (user_id === undefined) {
			return nextResponse({ error: "user_id is missing." }, 400);
		}

        let profileAvatar = avatar;

		// uploading the image if it's a base64 string
		if (avatar?.startsWith("data:image") && avatar_name && avatar_type) {
			const base64Data = avatar.split(",")[1];
			const buffer = Buffer.from(base64Data, "base64");
			const ext = avatar_name.split(".").pop();
			const path = `avatars/${user_id}.${ext}`;

			const { error } = await supabaseServer.storage
				.from("avatars")
				.upload(path, buffer, {
					contentType: avatar_type,
					upsert: true,
				});

			if (error) return nextResponse({ error: "Uploading failed." }, 400);

			const { data } = supabaseServer.storage
				.from("avatars")
				.getPublicUrl(path);

			profileAvatar = data.publicUrl;
		} 

		const { error: profileError } = await supabaseServer
			.from("profiles")
			.upsert(
				{ name, user_id, status, oneliner, bio, visibility, color, avatar: profileAvatar },
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

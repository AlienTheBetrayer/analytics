import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import type { Profile } from "@/types/api/database/profiles";
import { nextResponse } from "@/utils/response";
import { tokenVerify } from "@/utils/tokenVerify";

export const POST = async (request: NextRequest) => {
	try {
		const { user_id, avatar, avatar_name, avatar_type, ...rest } =
			await request.json();

		if (user_id === undefined) {
			return nextResponse({ error: "user_id is missing." }, 400);
		}

        tokenVerify(request, user_id);

		let profileAvatar = avatar;

		// uploading the image if it's a base64 string
		if (avatar?.startsWith("data:image") && avatar_name && avatar_type) {
			const base64Data = avatar.split(",")[1];
			const buffer = Buffer.from(base64Data, "base64");
			const ext = avatar_name.split(".").pop();
			const path = `${user_id}/${crypto.randomUUID()}.${ext}`;

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

		const { data: profileData, error: existingProfileError } =
			(await supabaseServer
				.from("profiles")
				.select()
				.eq("user_id", user_id)) as {
				data: Profile[];
				error: PostgrestError | null;
			};

		// checking if we're deleting avatar or changing it - deleting the old one from the db
		if (!avatar || profileAvatar !== profileData[0].avatar) {
			if (existingProfileError) {
				return nextResponse(existingProfileError, 400);
			}

			if (profileData[0].avatar) {
				const { error } = await supabaseServer.storage
					.from("avatars")
					.remove([
						`${user_id}/${profileData[0].avatar.substring(
							profileData[0].avatar.lastIndexOf("/") + 1,
						)}`,
					]);

				if (error) {
					return nextResponse({ error: "Avatar deleting failed." }, 400);
				}
			}
		}

		const { error: profileError } = await supabaseServer
			.from("profiles")
			.upsert(
				{
					user_id,
					avatar: profileAvatar,
					...rest,
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

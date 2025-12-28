import { supabaseClient } from "@/server/public/supabase";

/**
 * uploads the file to the database's storage
 * @param id the id of the user
 * @param file a file containing the image
 * @returns the public url for the image
 */
export const uploadAvatar = async (id: string, file: File) => {
	const ext = file.name.split(".").pop();
	const path = `avatars/${id}.${ext}`;

	const { error } = await supabaseClient.storage
		.from("avatars")
		.upload(path, file, {
			cacheControl: "3600",
			upsert: true,
			contentType: file.type,
		});

	if (error) {
		throw error;
	}

	const { data } = supabaseClient.storage.from("avatars").getPublicUrl(path);

	return data.publicUrl;
};

import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import "server-only";

/**
 * deletes the image from the server
 * @param user_id the user that's the owner of the image (folder)
 * @param url the full url for the image
 */
export const deleteImage = async (options: {
    user_id: string;
    url: string;
}) => {
    const { error } = await supabaseServer.storage
        .from("avatars")
        .remove([
            `${options.user_id}/${options.url.substring(options.url.lastIndexOf("/") + 1)}`,
        ]);

    if (error) {
        console.error(error);
        throw nextResponse({ error: "Image deleting has failed." }, 400);
    }

    return nextResponse({ message: "Image deletion has succeded!" }, 200);
};

/**
 * uploads the image in the storage
 * @param avatar base-64 version of the avatar url
 * @param avatar_name .name on File
 * @param avatar_type .type on File
 * @param user_id id of the user
 * @returns a promise containing the uploaded image's url
 */
export const uploadImage = async (options: {
    user_id: string;
    base64: string;
    name: string;
    type: string;
}) => {
    const base64Data = options.base64.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const ext = options.name.split(".").pop();
    const path = `${options.user_id}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabaseServer.storage
        .from("avatars")
        .upload(path, buffer, {
            contentType: options.type,
            upsert: true,
        });

    if (error) {
        console.error(error);
        throw nextResponse({ error: "Uploading failed." }, 400);
    }

    const { data } = supabaseServer.storage.from("avatars").getPublicUrl(path);

    return data.publicUrl;
};

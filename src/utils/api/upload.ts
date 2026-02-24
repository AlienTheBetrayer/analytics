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
    folder: string;
}) => {
    const { error } = await supabaseServer.storage
        .from(options.folder)
        .remove([
            `${options.user_id}/${options.url.substring(options.url.lastIndexOf("/") + 1)}`,
        ]);

    if (error) {
        console.error(error);
        throw nextResponse({ success: false }, 400);
    }

    return nextResponse({ success: true }, 200);
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
    folder: string;
}) => {
    const base64Data = options.base64.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const ext = options.name.split(".").pop();
    const path = `${options.user_id}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabaseServer.storage
        .from(options.folder)
        .upload(path, buffer, {
            contentType: options.type,
            upsert: true,
        });

    if (error) {
        console.error(error);
        throw nextResponse({ success: false }, 400);
    }

    const { data } = supabaseServer.storage
        .from(options.folder)
        .getPublicUrl(path);

    return data.publicUrl;
};

/**
 * handles the image creation and deletion (set image_base64 to null and fill existing_url to delete, otherwise upload)
 * @param user_id id of the user
 * @param image_base64 base-64 version of the image url
 * @param existing_url needed for deletion
 * @param image_name .name on File
 * @param image_type .type on File
 * @param folder folder in the database storage
 * @returns a promise containing the uploaded image's url (undefined for unchanged, null for deleted, string for url)
 */
export const handleImage = async (options: {
    user_id: string;
    image_base64: string | null | undefined;
    existing_url: string | undefined;
    image_name: string | undefined;
    image_type: string | undefined;
    folder: string;
}) => {
    // image has not been requested for a change
    if (options.image_base64 === undefined || options.image_base64 === "") {
        console.warn("skipped");
        return;
    }

    // delete first
    if (options.image_base64 === null && !options.existing_url) {
        throw "existing_url is undefined";
    }

    if (options.existing_url) {
        console.warn("deleting");

        await deleteImage({
            user_id: options.user_id,
            url: options.existing_url,
            folder: options.folder,
        });
    }

    if (options.image_base64 === null) {
        console.warn("deletion skipped");
        return null;
    }

    if (!options.image_name || !options.image_type) {
        throw "image_name and image_type are undefined";
    }

    // uploading + returning url
    console.warn("uploading");

    return await uploadImage({
        user_id: options.user_id,
        base64: options.image_base64,
        name: options.image_name,
        type: options.image_type,
        folder: options.folder,
    });
};

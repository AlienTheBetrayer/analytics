import { supabaseServer } from "@/server/private/supabase";
import { Profile } from "@/types/api/database/profiles";
import { PostgrestError } from "@supabase/supabase-js";
import "server-only";
import { nextResponse } from "./response";

export const deleteAvatar = async (user_id: string) => {
    const { data: profileData, error: existingProfileError } =
        (await supabaseServer
            .from("profiles")
            .select()
            .eq("user_id", user_id)) as {
            data: Profile[];
            error: PostgrestError | null;
        };

    if (existingProfileError) {
        throw nextResponse(existingProfileError, 400);
    }

    if (profileData[0].avatar) {
        const { error } = await supabaseServer.storage
            .from("avatars")
            .remove([
                `${user_id}/${profileData[0].avatar.substring(
                    profileData[0].avatar.lastIndexOf("/") + 1
                )}`,
            ]);
        if (error) {
            throw nextResponse({ error: "Avatar deleting failed." }, 400);
        }
    }

    return nextResponse({ message: "Successfully deleted the avatar." }, 200);
};

export const uploadAvatar = async (
    avatar: string,
    avatar_name: string,
    avatar_type: string,
    user_id: string
) => {
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

    if (error) throw nextResponse({ error: "Uploading failed." }, 400);

    const { data } = supabaseServer.storage.from("avatars").getPublicUrl(path);

    return data.publicUrl;
};

export const updateDb = async (user_id: string, rest: Record<string, string | null>) => {
    const { error: profileError } = await supabaseServer
        .from("profiles")
        .upsert(
            {
                user_id,
                ...rest,
            },
            { onConflict: "user_id" }
        );

    if (profileError) {
        throw nextResponse(profileError, 400);
    }

    return nextResponse(
        { message: "Successfully updated the profile data!" },
        200
    );
};

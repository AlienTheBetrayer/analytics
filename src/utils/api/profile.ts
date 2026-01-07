import "server-only";
import { supabaseServer } from "@/server/private/supabase";
import { Profile } from "@/types/tables/account";
import { PostgrestError } from "@supabase/supabase-js";
import { nextResponse } from "./response";
import bcrypt from "bcrypt";
import { AuthenticationRole } from "@/types/auth/authentication";
import { tokenVerify } from "../auth/tokenVerify";

/**
 * deletes the user's profile image from the storage
 * @param user_id the id of the user
 */
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

    if (profileData[0].avatar_url) {
        const { error } = await supabaseServer.storage
            .from("avatars")
            .remove([
                `${user_id}/${profileData[0].avatar_url.substring(
                    profileData[0].avatar_url.lastIndexOf("/") + 1
                )}`,
            ]);
        if (error) {
            throw nextResponse({ error: "Avatar deleting failed." }, 400);
        }
    }

    return nextResponse({ message: "Successfully deleted the avatar." }, 200);
};

/**
 * uploads the image in the storage
 * @param avatar base-64 version of the avatar url
 * @param avatar_name .name on File
 * @param avatar_type .type on File
 * @param user_id id of the user
 * @returns a promise containing the uploaded image's url
 */
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

/**
 * updates the database profiles with user_id as a conflict
 * @param user_id the user id
 * @param rest json data
 * @returns a promise containing the message
 */
export const updateProfile = async (
    user_id: string,
    rest: Record<string, unknown>
) => {
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
        console.error(profileError);
        throw nextResponse(profileError, 400);
    }

    return nextResponse(
        { message: "Successfully updated the profile data!" },
        200
    );
};

/**
 * updates the database colors in user_id's profile
 * @param user_id the user id
 * @param rest json data
 * @returns a promise containing the message
 */
export const updateColors = async (
    user_id: string,
    rest: Record<string, unknown>
) => {
    const colors = rest.colors as { slot: string; color: string }[];

    if (!colors) {
        return nextResponse({ message: "colors is missing." }, 400);
    }

    const colorsData = colors.map(({ slot, color }) => ({
        user_id,
        slot,
        color,
    }));

    const { error } = await supabaseServer
        .from("colors")
        .upsert(colorsData, { onConflict: "user_id,slot" });

    if (error) {
        console.error(error);
        return nextResponse(error, 400);
    }

    return nextResponse({ message: "colors updated!" }, 200);
};

/**
 * securely updates information about the user
 * @param user_id user id
 * @param rest json data
 * @returns a promise containing the message
 */
export const updateUser = async (
    user_id: string,
    rest: Record<string, unknown>
) => {
    const { role } = rest as { role: AuthenticationRole };

    if (!role) {
        return;
    }

    const { data: userData, error: userError } = await supabaseServer
        .from("users")
        .select()
        .eq("id", user_id);

    if (userError) {
        console.error(userError);
        return nextResponse(userError, 400);
    }

    if (!userData?.length) {
        console.error("User hasn't been created yet.");
        return nextResponse({ error: "User hasn't been created yet." }, 400);
    }

    const { error: roleError } = await supabaseServer
        .from("users")
        .update({ role })
        .eq("id", user_id);

    if (roleError) {
        console.error(roleError);
        return nextResponse({ roleError }, 400);
    }

    return nextResponse({ message: "role in profile updated!" }, 200);
};

/**
 * securely updates the database password in user_id
 * @param user_id the user id
 * @param rest json data
 * @returns a promise containing the message
 */
export const updatePassword = async (
    user_id: string,
    rest: Record<string, unknown>
) => {
    const { password } = rest as { password?: string };

    if (!password) {
        return;
    }


    const { data: userData, error: userError } = await supabaseServer
        .from("users")
        .select()
        .eq("id", user_id);

    if (userError) {
        console.error(userError);
        return nextResponse(userError, 400);
    }

    if (!userData?.length) {
        console.error("User hasn't been created yet.");
        return nextResponse({ error: "User hasn't been created yet." }, 400);
    }

    if (password.trim().length < 5) {
        console.error("username and password length has to be longer than 5.");
        return nextResponse(
            {
                error: "username and password length has to be longer than 5.",
            },
            400
        );
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const { error: changeError } = await supabaseServer
        .from("users")
        .update({ password: hashedPassword })
        .eq("id", user_id);

    if (changeError) {
        console.error(changeError);
        return nextResponse(changeError, 400);
    }

    return nextResponse({ message: "auth in profile updated!" }, 200);
};

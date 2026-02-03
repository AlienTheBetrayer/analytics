import "server-only";
import { supabaseServer } from "@/server/private/supabase";
import { Profile } from "@/types/tables/account";
import { PostgrestError } from "@supabase/supabase-js";
import { nextResponse } from "./response";
import bcrypt from "bcrypt";
import { AuthenticationRole } from "@/types/auth/authentication";
import { deleteImage } from "@/utils/api/upload";

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
        throw existingProfileError;
    }

    if (profileData[0].avatar_url) {
        await deleteImage({
            user_id,
            url: profileData[0].avatar_url,
            folder: "avatars",
        });
    }

    return nextResponse({ success: true }, 200);
};

/**
 * updates the database profiles with user_id as a conflict
 * @param user_id the user id
 * @param rest json data
 * @returns a promise containing the message
 */
export const updateProfile = async (
    user_id: string,
    rest: Record<string, unknown>,
) => {
    const { error: profileError } = await supabaseServer
        .from("profiles")
        .upsert(
            {
                user_id,
                ...rest,
            },
            { onConflict: "user_id" },
        );

    if (profileError) {
        throw profileError;
    }

    return nextResponse({ success: true }, 200);
};

/**
 * updates the database colors in user_id's profile
 * @param user_id the user id
 * @param rest json data
 * @returns a promise containing the message
 */
export const updateColors = async (
    user_id: string,
    rest: Record<string, unknown>,
) => {
    const colors = rest.colors as { slot: string; color: string }[];

    if (!colors) {
        throw "colors is undefined";
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
        throw error;
    }

    return nextResponse({ success: true }, 200);
};

/**
 * securely updates information about the user
 * @param user_id user id
 * @param rest json data
 * @returns a promise containing the message
 */
export const updateUser = async (
    user_id: string,
    rest: Record<string, unknown>,
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
        throw userError;
    }

    if (!userData?.length) {
        throw "user hasn't been created yet";
    }

    const { error: roleError } = await supabaseServer
        .from("users")
        .update({ role })
        .eq("id", user_id);

    if (roleError) {
        throw roleError;
    }

    return nextResponse({ success: true }, 200);
};

/**
 * securely updates the database password in user_id
 * @param user_id the user id
 * @param rest json data
 * @returns a promise containing the message
 */
export const updateUserData = async (
    user_id: string,
    rest: Record<string, unknown>,
) => {
    const { password, username } = rest as {
        password?: string;
        username?: string;
    };

    if (!(password || username)) {
        throw "password and username are undefined";
    }

    const { data: userData, error: userError } = await supabaseServer
        .from("users")
        .select()
        .eq("id", user_id);

    if (userError) {
        throw userError;
    }

    if (!userData?.length) {
        throw "user hasn't been created yet";
    }

    if (password && password.trim().length < 5) {
        throw "username and password have to be longer than 5";
    }

    const data = {
        ...(password && { password: await bcrypt.hash(password.trim(), 10) }),
        ...(username && { username }),
    };

    const { error: changeError } = await supabaseServer
        .from("users")
        .update(data)
        .eq("id", user_id);

    if (changeError) {
        throw changeError;
    }

    return nextResponse({ success: true }, 200);
};

import type { NextRequest } from "next/server";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import {
    updateProfile,
    updateColors,
    updateUser,
    updateUserData,
} from "@/utils/api/profile";
import { nextResponse } from "@/utils/api/response";
import { handleImage } from "@/utils/api/upload";
import { supabaseServer } from "@/server/private/supabase";

export const POST = async (request: NextRequest) => {
    try {
        const { user_id, ...rest } = await request.json();

        if (!user_id) {
            throw "user_id is undefined";
        }

        tokenVerify({ request, id: [user_id] });

        if ("image" in rest) {
            const { data, error } = await supabaseServer
                .from("profiles")
                .select("avatar_url")
                .eq("user_id", user_id)
                .single();

            if (error) {
                throw error;
            }

            rest.avatar_url = await handleImage({
                user_id,
                image_base64: rest.image,
                existing_url: data.avatar_url,
                image_name: rest?.image_name,
                image_type: rest?.image_type,
                folder: "avatars",
            });

            delete rest.image;
            delete rest.image_name;
            delete rest.image_type;
        }

        if (rest.colors) {
            await updateColors(user_id, rest);
            delete rest.colors;
        }

        if (rest.role) {
            tokenVerify({ request, id: [user_id], role: "op" });
            await updateUser(user_id, rest);
            delete rest.role;
        }

        if (rest.password || rest.username) {
            await updateUserData(user_id, rest);
            delete rest.password;
            delete rest.username;
        }

        await updateProfile(user_id, rest);

        return nextResponse({ success: true }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

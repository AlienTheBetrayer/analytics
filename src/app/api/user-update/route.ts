import type { NextRequest } from "next/server";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import {
    deleteAvatar,
    updateProfile,
    updateColors,
    updateUser,
    updateUserData,
} from "@/utils/api/profile";
import { nextResponse } from "@/utils/api/response";
import { uploadImage } from "@/utils/api/upload";

export const POST = async (request: NextRequest) => {
    try {
        const { user_id, ...rest } = await request.json();

        if (!user_id) {
            console.error("[user-update]: user_id is missing.");
            return nextResponse({ error: "user_id is missing." }, 400);
        }

        tokenVerify(request, [user_id]);

        if ("avatar_url" in rest) {
            if (rest.avatar_url === null) {
                // delete
                await deleteAvatar(user_id);
            } else if (
                typeof rest.avatar_url === "string" &&
                rest.avatar_url.startsWith("data:image") &&
                rest.avatar_name &&
                rest.avatar_type
            ) {
                // update
                await deleteAvatar(user_id);

                const url = await uploadImage({
                    base64: rest.avatar_url,
                    name: rest.avatar_name,
                    type: rest.avatar_type,
                    user_id,
                    folder: "avatars",
                });
                delete rest.avatar_name;
                delete rest.avatar_type;

                rest.avatar_url = url;
            } else {
                // unknown avatar format
                delete rest.avatar_url;
            }
        }

        if (rest.colors) {
            await updateColors(user_id, rest);
            delete rest.colors;
        }

        if (rest.role) {
            tokenVerify(request, [user_id], "op");
            await updateUser(user_id, rest);
            delete rest.role;
        }

        if (rest.password || rest.username) {
            await updateUserData(user_id, rest);
            delete rest.password;
            delete rest.username;
        }

        await updateProfile(user_id, rest);

        return nextResponse(
            { message: "Successfully updated the profile data!" },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ error: "Profile updating has failed." }, 400);
    }
};

import type { NextRequest } from "next/server";
import { nextResponse } from "@/utils/response";
import { tokenVerify } from "@/utils/tokenVerify";
import { deleteAvatar, uploadAvatar, updateDb } from "@/utils/profile";

export const POST = async (request: NextRequest) => {
    try {
        const { user_id, ...rest } = await request.json();

        if (user_id === undefined) {
            return nextResponse({ error: "user_id is missing." }, 400);
        }

        tokenVerify(request, user_id);

        if ("avatar" in rest) {
            if (rest.avatar === null) {
                // delete
                await deleteAvatar(user_id);
            } else if (
                typeof rest.avatar === "string" &&
                rest.avatar.startsWith("data:image") &&
                rest.avatar_name &&
                rest.avatar_type
            ) {
                // update
                await deleteAvatar(user_id);

                const url = await uploadAvatar(
                    rest.avatar,
                    rest.avatar_name,
                    rest.avatar_type,
                    user_id
                );
                delete rest.avatar_name;
                delete rest.avatar_type;

                rest.avatar = url;
            } else {
                // unknown avatar format
                delete rest.avatar;
            }
        }

        return await updateDb(user_id, rest);
    } catch {
        return nextResponse({ error: "Profile updating has failed." }, 400);
    }
};

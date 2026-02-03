import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { nextResponse } from "@/utils/api/response";

export const POST = async (request: NextRequest) => {
    try {
        const { user_id } = await request.json();

        if (!user_id) {
            throw "user_id is undefined";
        }

        tokenVerify({ request, id: [user_id] });

        // deleting profile images
        const { data: avatarData, error: avatarError } =
            await supabaseServer.storage.from("avatars").list(user_id);

        if (avatarError) {
            throw avatarError;
        }

        if (avatarData?.length) {
            const paths = avatarData.map(
                (data) => `avatars/${user_id}/${data.name}`,
            );

            const { error: avatarDeleteError } = await supabaseServer.storage
                .from("avatars")
                .remove(paths);

            if (avatarDeleteError) {
                throw avatarDeleteError;
            }
        }

        // deleting the actual user
        const { error: deleteError } = await supabaseServer
            .from("users")
            .delete()
            .eq("id", user_id);

        if (deleteError) {
            throw deleteError;
        }

        return nextResponse({ success: true }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

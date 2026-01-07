import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { nextResponse } from "@/utils/api/response";

export const POST = async (request: NextRequest) => {
    try {
        const { id } = await request.json();

        if (!id) {
            return nextResponse({ error: "id is missing." }, 400);
        }

        tokenVerify(request, id);

        // deleting profile images
        const { data: avatarData, error: avatarError } =
            await supabaseServer.storage.from("avatars").list(id);

        if (avatarError) {
            console.error(avatarError);
            return nextResponse(avatarError, 400);
        }

        if (avatarData?.length) {
            const paths = avatarData.map(
                (data) => `avatars/${id}/${data.name}`
            );

            const { error: avatarDeleteError } = await supabaseServer.storage
                .from("avatars")
                .remove(paths);

            if (avatarDeleteError) {
                console.error(avatarDeleteError);
                return nextResponse(avatarDeleteError, 400);
            }
        }

        // deleting the actual user
        const { error: deleteError } = await supabaseServer
            .from("users")
            .delete()
            .eq("id", id);

        if (deleteError) {
            console.error(deleteError);
            return nextResponse(deleteError, 400);
        }

        return nextResponse({ message: "Successful account deletion." }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ error: "Account deletion has failed." }, 400);
    }
};

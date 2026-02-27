import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { handleImage } from "@/utils/api/upload";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const {
            description,
            image,
            image_name,
            image_type,
            user_id,
            conversation_id,
        } = await request.json();

        if (!user_id || !conversation_id) {
            throw "user_id and conversation_id are undefined";
        }

        // permissions
        tokenVerify({ request, id: [user_id] });

        // image uploading
        let image_url: string | null | undefined = undefined;

        if (image) {
            if (!image_name || !image_type) {
                throw "image_name and image_type are undefined";
            }

            image_url = await handleImage({
                user_id,
                image_base64: image,
                existing_url: undefined,
                image_name,
                image_type,
                folder: "invitations",
            });
        }

        // data
        const { data, error } = await supabaseServer
            .from("invitations")
            .insert({
                conversation_id,
                inviter_id: user_id,
                description,
                ...(image_url && { image_url }),
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return nextResponse({ success: true, invitation: data }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

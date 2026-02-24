import { supabaseServer } from "@/server/private/supabase";
import { Conversation } from "@/types/tables/messages";
import { nextResponse } from "@/utils/api/response";
import { deleteImage } from "@/utils/api/upload";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { type, user_id, conversation_id } = await request.json();

        if (!type || !user_id || !conversation_id) {
            throw "user_id and conversation_id and type are undefined";
        }

        // permissions & whether we're a member of that conversation
        tokenVerify({ request, id: [user_id] });

        const { data: conversation, error } = await supabaseServer
            .from("conversations")
            .select("id, conversation_members:conversation_members(user_id)")
            .eq("id", conversation_id)
            .single();

        if (error) {
            throw error;
        }

        if (
            !conversation.conversation_members.some(
                (m) => m.user_id === user_id,
            )
        ) {
            throw "lacking permissions";
        }

        switch (type) {
            case "leave": {
                const { error } = await supabaseServer
                    .from("conversation_members")
                    .delete()
                    .eq("conversation_id", conversation_id)
                    .eq("user_id", user_id);

                if (error) {
                    throw error;
                }

                return nextResponse({ success: true }, 200);
            }
            case "delete-all": {
                const { data, error } = (await supabaseServer
                    .from("conversations")
                    .delete()
                    .eq("id", conversation_id)
                    .select()
                    .single()) as {
                    data: Conversation;
                    error: PostgrestError | null;
                };

                if (error) {
                    throw error;
                }

                if (data.image_url) {
                    await deleteImage({
                        user_id,
                        folder: "conversation",
                        url: data.image_url,
                    });
                }

                return nextResponse({ success: true }, 200);
            }
            default: {
                throw "type is invalid. available: leave/delete-all";
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

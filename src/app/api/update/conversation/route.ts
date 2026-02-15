import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const {
            conversation_id,
            user_id,
            title,
            description,
            pinned,
            archived,
        } = await request.json();

        if (!conversation_id || !user_id) {
            throw "conversation_id and user_id are undefined";
        }

        // permissions
        {
            const { data, error } = await supabaseServer
                .from("conversation_members")
                .select("user_id")
                .eq("conversation_id", conversation_id)
                .in("user_id", [user_id]);

            if (error) {
                throw error;
            }

            if (!data?.length) {
                throw "wrong permissions";
            }
        }

        // meta data
        if (typeof title === "string" || typeof description === "string") {
            const { error } = await supabaseServer
                .from("conversations")
                .update({
                    ...(typeof title === "string" && { title }),
                    ...(typeof description === "string" && { description }),
                })
                .eq("id", conversation_id);

            if (error) {
                throw error;
            }
        }

        // conversation data
        if (typeof pinned === "boolean" || typeof archived === "boolean") {
            const { error } = await supabaseServer
                .from("conversation_meta")
                .upsert(
                    {
                        conversation_id,
                        user_id,
                        ...(typeof pinned === "boolean" && { pinned }),
                        ...(typeof archived === "boolean" && { archived }),
                    },
                    { onConflict: "user_id,conversation_id" },
                );

            if (error) {
                throw error;
            }
        }

        return nextResponse({ success: true }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

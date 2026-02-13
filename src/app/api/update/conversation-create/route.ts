import { supabaseServer } from "@/server/private/supabase";
import { Conversation } from "@/types/tables/messages";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { user_id, type, member_ids, title, description } =
            await request.json();

        if (!user_id) {
            throw "user_id is undefined";
        }

        tokenVerify({ request, id: [user_id] });

        // id selecting
        let user_ids = [];

        switch (type) {
            case "notes": {
                user_ids = [user_id];
                break;
            }
            case "dm": {
                if (typeof member_ids !== "string") {
                    throw "member_ids is undefined";
                }

                user_ids = [user_id, member_ids];
                break;
            }
            case "group": {
                if (typeof member_ids !== "string") {
                    throw "what is undefined";
                }

                user_ids = [user_id, ...member_ids.split(",")];
                break;
            }
            case "channel": {
                user_ids = [user_id];
                break;
            }
            default: {
                throw "type is wrong. available: notes/dm/group/channel";
            }
        }

        // conversation
        const { data, error } = (await supabaseServer
            .from("conversations")
            .insert({ type, title, description })
            .select()
            .single()) as {
            data: Conversation;
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        // members
        {
            const { error } = await supabaseServer
                .from("conversation_members")
                .insert(
                    user_ids.map((user_id) => ({
                        conversation_id: data.id,
                        user_id,
                    })),
                );

            if (error) {
                throw error;
            }
        }

        return nextResponse({ success: true, conversation: data }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

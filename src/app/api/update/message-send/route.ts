import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { from_id, to_id, conversation_id, message } =
            await request.json();

        if (!from_id || !message) {
            throw "from_id and to_id and message are undefined";
        }

        tokenVerify({ request, id: [from_id] });

        // if we give no conversation_id - find it, if it exists - send, if it doesn't - create a conversation and send
        let id = conversation_id;

        if (!conversation_id) {
            if (!to_id) {
                throw "to_id is undefined";
            }

            const { data, error } = (await supabaseServer
                .from("conversations")
                .select(
                    "id, conversation_members:conversation_members(user_id)",
                )
                .filter("conversation_members.user_id", "eq", from_id)
                .filter("conversation_members.user_id", "eq", to_id)
                .eq("type", "dm")) as {
                data: { id: string }[];
                error: PostgrestError | null;
            };

            if (error) {
                throw error;
            }

            if (!data?.length) {
                const { data: newId, error } = await supabaseServer
                    .from("conversations")
                    .insert({ type: "dm" })
                    .select("id");

                if (error) {
                    throw error;
                }

                id = newId[0].id;

                {
                    const { error } = await supabaseServer
                        .from("conversation_members")
                        .insert([
                            { conversation_id: id, user_id: from_id },
                            { conversation_id: id, user_id: to_id },
                        ]);

                    if (error) {
                        throw error;
                    }
                }
            }
        }

        // if we give conversation_id - send
        const { data, error } = await supabaseServer
            .from("messages")
            .insert({ user_id: from_id, conversation_id: id, message })
            .select();

        if (error) {
            throw error;
        }

        return nextResponse({ success: true, message: data[0] });
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { type, from_id, to_id, message, conversation_id, message_id } =
            await request.json();

        if (!type || !from_id) {
            throw "type and from_id are undefined";
        }

        tokenVerify({ request, id: [from_id] });

        let cid = conversation_id;

        switch (type) {
            case "send": {
                if (!message) {
                    throw "message is undefined";
                }

                // retrieving conversation id in case the dm hasn't been started yet
                if (!conversation_id) {
                    if (!to_id) {
                        throw "to_id is undefined";
                    }

                    const { data, error } = await supabaseServer
                        .from("conversations")
                        .select(
                            `
                                        id,
                                        conversation_members!inner(user_id)
                                    `,
                        )
                        .eq("type", "dm")
                        .in("conversation_members.user_id", [from_id, to_id]);

                    if (error) {
                        throw error;
                    }

                    cid = data?.[0]?.id;

                    if (data?.length < 2) {
                        const { data: newId, error } = await supabaseServer
                            .from("conversations")
                            .insert({ type: "dm" })
                            .select("id")
                            .single();

                        if (error) {
                            throw error;
                        }

                        cid = newId.id;

                        const { error: memberError } = await supabaseServer
                            .from("conversation_members")
                            .insert([
                                { conversation_id: cid, user_id: from_id },
                                { conversation_id: cid, user_id: to_id },
                            ]);

                        if (memberError) {
                            throw memberError;
                        }
                    }
                }

                const { data, error } = await supabaseServer
                    .from("messages")
                    .insert({
                        user_id: from_id,
                        conversation_id: cid,
                        message,
                        type: "message",
                    })
                    .select("*, conversation:conversations(*)")
                    .single();

                if (error) {
                    throw error;
                }

                return nextResponse({ success: true, message: data }, 200);
            }
            case "edit": {
                if (!message_id) {
                    throw "message_id is undefined";
                }

                const { data, error } = await supabaseServer
                    .from("messages")
                    .update({ message })
                    .eq("id", message_id)
                    .select("*, conversation:conversations(*)")
                    .single();

                if (error) {
                    throw error;
                }

                return nextResponse({ success: true, message: data }, 200);
            }
            default: {
                throw "type is invalid. available: send/edit";
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

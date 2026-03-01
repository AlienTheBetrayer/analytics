import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const {
            type,
            user_ids,
            conversation_id,
            can_read,
            can_delete_messages,
            can_kick,
            can_invite,
        } = await request.json();

        if (!type || !conversation_id || !user_ids) {
            throw "type and conversation_id and user_ids are undefined";
        }

        // permissions

        // get usernames for a system message
        const { data: usernames, error } = await supabaseServer
            .from("users")
            .select("username")
            .in("id", user_ids);

        if (error) {
            throw error;
        }

        switch (type) {
            case "add": {
                // the actual members
                {
                    const { error } = await supabaseServer
                        .from("conversation_members")
                        .insert(
                            (user_ids as string[]).map((user_id) => ({
                                conversation_id,
                                user_id,
                            })),
                        );

                    if (error) {
                        throw error;
                    }
                }

                // system message
                {
                    const { error } = await supabaseServer
                        .from("messages")
                        .insert({
                            message:
                                user_ids.length > 10
                                    ? `${user_ids.length} users have joined!`
                                    : `${usernames.map((u) => u.username).join(", ")} ${user_ids.length > 1 ? "have" : "has"} joined!`,
                            type: "system",
                            conversation_id,
                            user_id: null,
                        });

                    if (error) {
                        throw error;
                    }
                }

                return nextResponse({ success: true }, 200);
            }
            case "kick": {
                const { error } = await supabaseServer
                    .from("conversation_members")
                    .delete()
                    .eq("conversation_id", conversation_id)
                    .in("user_id", user_ids);

                if (error) {
                    throw error;
                }

                // system message
                {
                    const { error } = await supabaseServer
                        .from("messages")
                        .insert({
                            message:
                                user_ids.length > 10
                                    ? `${user_ids.length} users have been kicked`
                                    : `${usernames.map((u) => u.username).join(", ")} ${user_ids.length > 1 ? "have" : "has"} been kicked`,
                            type: "system",
                            conversation_id,
                            user_id: null,
                        });

                    if (error) {
                        throw error;
                    }
                }

                return nextResponse({ success: true }, 200);
            }
            case "permissions": {
                const { error } = await supabaseServer
                    .from("conversation_members")
                    .update({
                        ...(typeof can_read === "boolean" && { can_read }),
                        ...(typeof can_kick === "boolean" && { can_kick }),
                        ...(typeof can_delete_messages === "boolean" && {
                            can_delete_messages,
                        }),
                        ...(typeof can_invite === "boolean" && { can_invite }),
                    })
                    .eq("conversation_id", conversation_id)
                    .in("user_id", user_ids);

                if (error) {
                    throw error;
                }

                return nextResponse({ success: true }, 200);
            }
            default: {
                throw "type is invalid. available: add/kick";
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

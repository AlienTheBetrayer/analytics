import { supabaseServer } from "@/server/private/supabase";
import { Conversation } from "@/types/tables/messages";
import { nextResponse } from "@/utils/api/response";
import { handleImage } from "@/utils/api/upload";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const {
            type,
            conversation_id,
            user_id,
            member_ids,
            conversation_type,
            title,
            description,
            pinned,
            archived,
            image,
            image_name,
            image_type,
            ids,
        } = await request.json();

        if (!type || !user_id) {
            throw "type and user_id are undefined";
        }

        tokenVerify({ request, id: [user_id] });

        switch (type) {
            case "create": {
                if (!conversation_type) {
                    throw "conversation_type is undefined";
                }

                let user_ids = [];
                let initialMessage = "";

                switch (conversation_type) {
                    case "notes": {
                        user_ids = [user_id];
                        initialMessage = "Notes created";
                        break;
                    }
                    case "dm": {
                        if (typeof member_ids !== "string") {
                            throw "member_ids is undefined";
                        }

                        user_ids = [user_id, member_ids];
                        initialMessage = "Conversation created";
                        break;
                    }
                    case "group": {
                        user_ids = [
                            user_id,
                            ...(member_ids ? member_ids.split(",") : []),
                        ];
                        initialMessage = "Group created";
                        break;
                    }
                    case "channel": {
                        user_ids = [
                            user_id,
                            ...(member_ids ? member_ids.split(",") : []),
                        ];
                        initialMessage = "Channel created";
                        break;
                    }
                    default: {
                        throw "invalid conversation_type. available: notes/dm/group/channel";
                    }
                }

                // conversation
                const { data, error } = (await supabaseServer
                    .from("conversations")
                    .insert({
                        type: conversation_type,
                        ...(title && { title }),
                        ...(description && { description }),
                    })
                    .select()
                    .single()) as {
                    data: Conversation;
                    error: PostgrestError | null;
                };

                if (error) {
                    throw error;
                }

                // image
                if (image) {
                    const url = await handleImage({
                        user_id,
                        image_base64: image,
                        existing_url: data.image_url,
                        image_name,
                        image_type,
                        folder: "conversation",
                    });

                    const { error } = await supabaseServer
                        .from("conversations")
                        .update({ image_url: url })
                        .eq("id", data.id);

                    if (error) {
                        throw error;
                    }
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

                // initial system message
                {
                    const { error } = await supabaseServer
                        .from("messages")
                        .insert({
                            message: initialMessage,
                            type: "system",
                            conversation_id: data.id,
                            user_id: null,
                        });

                    if (error) {
                        throw error;
                    }
                }

                return nextResponse({ success: true }, 200);
            }
            case "edit": {
                if (!conversation_id) {
                    throw "conversation_id is undefined";
                }

                // image
                let url: string | undefined | null = undefined;
                if (image || image === null) {
                    const { data, error } = await supabaseServer
                        .from("conversations")
                        .select("image_url")
                        .eq("id", conversation_id)
                        .single();

                    if (error) {
                        throw error;
                    }

                    url = await handleImage({
                        user_id,
                        image_base64: image,
                        existing_url: data.image_url,
                        image_name,
                        image_type,
                        folder: "conversation",
                    });
                }

                // conversation data
                if (
                    typeof title === "string" ||
                    typeof description === "string" ||
                    url !== undefined
                ) {
                    const { error } = await supabaseServer
                        .from("conversations")
                        .update({
                            ...(typeof title === "string" && { title }),
                            ...(typeof description === "string" && {
                                description,
                            }),
                            ...((url || url === null) && {
                                image_url: url,
                            }),
                            edited_at: new Date().toISOString(),
                        })
                        .eq("id", conversation_id);

                    if (error) {
                        throw error;
                    }
                }

                // meta data
                if (
                    typeof pinned === "boolean" ||
                    typeof archived === "boolean"
                ) {
                    const { error } = await supabaseServer
                        .from("conversation_meta")
                        .upsert(
                            {
                                conversation_id,
                                user_id,
                                ...(typeof pinned === "boolean" && {
                                    pinned,
                                    pinned_at: new Date().toISOString(),
                                }),
                                ...(typeof archived === "boolean" && {
                                    archived,
                                }),
                            },
                            { onConflict: "user_id,conversation_id" },
                        );

                    if (error) {
                        throw error;
                    }
                }

                return nextResponse({ success: true }, 200);
            }
            case "add_members": {
                if (!ids?.length || !conversation_id) {
                    throw "ids and conversation_id are undefined";
                }

                const { error } = await supabaseServer
                    .from("conversation_members")
                    .insert(
                        (ids as string[]).map((user_id) => ({
                            conversation_id,
                            user_id,
                        })),
                    );

                if (error) {
                    throw error;
                }

                return nextResponse({ success: true }, 200);
            }
            default: {
                throw "invalid type. available: create/edit";
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

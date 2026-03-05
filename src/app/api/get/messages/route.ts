import { supabaseServer } from "@/utils/server/private/supabase";
import { ConversationMember } from "@/types/tables/messages";
import { nextResponse } from "@/utils/api/response";
import { tokenPayload } from "@/utils/auth/tokenPayload";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const conversation_id = searchParams.get("conversation_id");

        if (!conversation_id) {
            throw "conversation_id is undefined";
        }

        // permissions & misc
        {
            const token = tokenPayload(request)?.accessToken;

            if (!token) {
                throw "unauthenticated.";
            }

            const { data, error } = (await supabaseServer
                .from("conversation_members")
                .select()
                .eq("conversation_id", conversation_id)
                .eq("user_id", token?.id)
                .single()) as {
                data: ConversationMember;
                error: PostgrestError | null;
            };

            if (error) {
                throw error;
            }

            // muted
            if (data.muted_until && new Date(data.muted_until) > new Date()) {
                throw "muted";
            }

            // unmuted removing + unread clearing
            {
                const { error } = await supabaseServer
                    .from("conversation_members")
                    .update({
                        ...(data.muted_until &&
                            new Date(data.muted_until) < new Date() && {
                                muted_until: null,
                            }),
                        ...(data.unread_amount && { unread_amount: null }),
                    })
                    .eq("conversation_id", conversation_id)
                    .eq("user_id", data.user_id);

                if (error) {
                    throw error;
                }
            }

            // unread (clearing)
            if (data.unread_amount) {
            }

            // not a member
            if (!data) {
                throw "not-allowed";
            }

            // can't read
            if (data.can_read === false) {
                throw "cant-read";
            }
        }

        const { data, error } = await supabaseServer
            .from("messages")
            .select(
                `*, 
                user:users(id, username, last_seen_at, profile:profiles(avatar_url, color)),
                reply:reply_id(*, user:users(id, username, last_seen_at, profile:profiles(avatar_url, color))),
                forward:forward_id(*, user:users(id, username, last_seen_at, profile:profiles(avatar_url, color)))`,
            )
            .eq("conversation_id", conversation_id);

        if (error) {
            throw error;
        }

        return nextResponse({ success: true, messages: data }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse(
            {
                success: false,
                ...(typeof error === "string" && { error }),
            },
            400,
        );
    }
};

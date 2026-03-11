/** @format */

import { supabaseServer } from "@/utils/server/private/supabase";
import { ConversationMember, Message } from "@/types/tables/messages";
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
        await handleMeta(request, searchParams);

        // message objects
        const { data: messages, error } = (await supabaseServer
            .from("messages")
            .select(`*, reply:reply_id(*), forward:forward_id(*)`)
            .eq("conversation_id", conversation_id)
            .order("created_at", { ascending: true })) as {
            data: (Message & { reply?: Message; forward?: Message })[];
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        // user objects
        const ids = new Set();

        for (const m of messages) {
            if (!m.user_id) {
                continue;
            }

            ids.add(m.user_id);

            if (m.reply) {
                ids.add(m.reply.user_id);
            } else if (m.forward) {
                ids.add(m.forward.user_id);
            }
        }

        const { data: users, error: usersError } = await supabaseServer
            .from("users")
            .select("id, username, last_seen_at, profile:profiles(avatar_url, color)")
            .in("id", Array.from(ids));

        if (usersError) {
            throw usersError;
        }

        return nextResponse(
            {
                success: true,
                messages,
                users,
            },
            200,
        );
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

const handleMeta = async (request: NextRequest, searchParams: URLSearchParams) => {
    const conversation_id = searchParams.get("conversation_id");

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

    // not a member
    if (!data) {
        throw "not-allowed";
    }

    // can't read
    if (data.can_read === false) {
        throw "cant-read";
    }
};

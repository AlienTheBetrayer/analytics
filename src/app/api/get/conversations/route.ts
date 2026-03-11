/** @format */

import { supabaseServer } from "@/utils/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const user_id = searchParams.get("user_id");

        if (!user_id) {
            throw "user_id is undefined";
        }

        const { data: conversations, error } = await supabaseServer
            .from("conversations")
            .select(
                `
                    *, 
                    membership:conversation_members!inner(*),
                    last_message:messages(*, user:users(id, username, last_seen_at, profile:profiles(avatar_url, color))),
                    peer:conversation_members(user:users(id, username, last_seen_at, profile:profiles(avatar_url, color))),
                    conversation_meta:conversation_meta(pinned, archived, pinned_at)
                `,
            )
            .eq("membership.user_id", user_id)
            .eq("conversation_meta.user_id", user_id)
            .neq("peer.user_id", user_id)
            .order("created_at", {
                referencedTable: "last_message",
                ascending: false,
            })
            .order("created_at", {
                ascending: false,
            })
            .limit(1, { referencedTable: "last_message" })
            .limit(1, { referencedTable: "peer" });

        if (error) {
            throw error;
        }

        const sorted = conversations.sort((a, b) => {
            const aTime: string = a.conversation_meta?.[0]?.pinned_at || "";
            const bTime: string = b.conversation_meta?.[0]?.pinned_at || "";
            return bTime.localeCompare(aTime);
        });

        return nextResponse(
            {
                success: true,
                conversations: sorted.map((c) => ({
                    ...c,
                    last_message: c.last_message?.[0],
                    membership: c.membership?.[0],
                    conversation_meta: c.conversation_meta?.[0],
                    peer: c.peer?.[0]?.user,
                })),
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const user_id = searchParams.get("user_id");

        if (!user_id) {
            throw "user_id is undefined";
        }

        const { data, error } = await supabaseServer
            .from("conversations")
            .select(
                `
                    *, 
                    membership:conversation_members!inner(user_id),
                    conversation_members:conversation_members(user_id, created_at, user:users(id, username, role, created_at, last_seen_at, profile:profiles(*))),
                    last_message:messages(*, user:users(*, profile:profiles(*))),
                    conversation_meta:conversation_meta(pinned, archived, pinned_at)
                `,
            )
            .eq("membership.user_id", user_id)
            .eq("conversation_meta.user_id", user_id)
            .order("created_at", {
                referencedTable: "last_message",
                ascending: false,
            })
            .order("created_at", {
                ascending: false,
            })
            .limit(1, { referencedTable: "last_message" });

        if (error) {
            throw error;
        }

        return nextResponse(
            {
                success: true,
                conversations: data.map((entry) => ({
                    ...entry,
                    last_message: entry.last_message?.[0],
                    conversation_meta: entry.conversation_meta?.[0],
                })),
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

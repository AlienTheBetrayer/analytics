import { supabaseServer } from "@/server/private/supabase";
import { Profile, User } from "@/types/tables/account";
import {
    Conversation,
    ConversationMember,
    Message,
} from "@/types/tables/messages";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const user_id = searchParams.get("user_id");

        if (!user_id) {
            throw "username is undefined";
        }

        const { data, error } = (await supabaseServer
            .from("conversations")
            .select(
                `
                    *, 
                    membership:conversation_members!inner(user_id),
                    conversation_members:conversation_members(*, user:users(*, profile:profiles(*))),
                    last_message:messages(*)
                `,
            )
            .eq("membership.user_id", user_id)
            .order("created_at", {
                referencedTable: "last_message",
                ascending: false,
            })
            .limit(1, { referencedTable: "last_message" })) as {
            data: (Conversation & {
                membership: { user_id: string };
                conversation_members: ConversationMember & {
                    user: User & Profile;
                };
                last_message: Message[];
            })[];
            error: PostgrestError | null;
        };

        if (error) {
            throw error;
        }

        return nextResponse(
            {
                success: true,
                conversations: data.map((entry) => ({
                    ...entry,
                    last_message: entry.last_message?.[0],
                })),
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

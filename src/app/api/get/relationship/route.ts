import { supabaseServer } from "@/server/private/supabase";
import { FriendRequest } from "@/types/tables/account";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const from_id = searchParams.get("from_id");
        const to_id = searchParams.get("to_id");

        if (!(from_id && to_id)) {
            throw "from_id and to_id are undefined";
        }

        // requests
        const { data: requestData, error: requestError } = (await supabaseServer
            .from("friend_requests")
            .select()
            .or(
                `and(from_id.eq.${from_id},to_id.eq.${to_id}),and(from_id.eq.${to_id},to_id.eq.${from_id})`,
            )) as { data: FriendRequest[]; error: PostgrestError | null };

        if (requestError) {
            throw requestError;
        }

        // friends
        const { count: friendCount, error: friendError } = (await supabaseServer
            .from("friends")
            .select("*", { count: "exact", head: true })
            .or(
                `and(user1_id.eq.${from_id},user2_id.eq.${to_id}),and(user1_id.eq.${to_id},user2_id.eq.${from_id})`,
            )) as { count: number | null; error: PostgrestError | null };

        if (friendError) {
            throw friendError;
        }

        return nextResponse(
            {
                success: true,
                relationship: {
                    sent: requestData?.[0]?.from_id === from_id,
                    received: requestData?.[0]?.to_id === from_id,
                    friends: !!friendCount,
                },
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

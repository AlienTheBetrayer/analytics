import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/response";
import { tokenVerify } from "@/utils/tokenVerify";

export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) => {
    try {
        const { id } = await params;

        tokenVerify(request, id);

        const { data: friendsData, error: friendsError } = (await supabaseServer
            .from("friends")
            .select()
            .or(`user1_id.eq.${id},user2_id.eq.${id}`)) as {
            data: { id: string; user1_id: string; user2_id: string }[];
            error: PostgrestError | null;
        };

        if (friendsError) {
            return nextResponse(friendsError, 400);
        }

        const friends = friendsData.map((f) => ({
            id: f.user1_id === id ? f.user2_id : f.user1_id,
        }));

        return nextResponse({ friends }, 200);
    } catch {
        return nextResponse({ error: "Failed getting a friend list." }, 400);
    }
};

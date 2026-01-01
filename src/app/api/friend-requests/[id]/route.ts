import type { PostgrestError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/response";
import { tokenVerify } from "@/utils/tokenVerify";

export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;

        tokenVerify(request, id);

        const { data: friendsData, error: friendsError } = (await supabaseServer
            .from("friend_requests")
            .select()
            .or(`from_id.eq.${id},to_id.eq.${id}`)) as {
            data: { id: string; from_id: string; to_id: string }[];
            error: PostgrestError | null;
        };

        if (friendsError) {
            return nextResponse(friendsError, 400);
        }

        const requests = friendsData.filter(
            (data) => data.to_id === id || data.from_id === id
        );

        return nextResponse({ requests }, 200);
    } catch {
        return nextResponse(
            { error: "Failed getting friends' requests." },
            400
        );
    }
};

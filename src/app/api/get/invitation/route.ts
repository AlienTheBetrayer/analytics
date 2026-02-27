import { supabaseServer } from "@/server/private/supabase";
import { Invitation } from "@/types/tables/invitations";
import { nextResponse } from "@/utils/api/response";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const user_id = searchParams.get("user_id");
        const invitation_id = searchParams.get("invitation_id");

        if (!invitation_id) {
            throw "invitation_id are undefined";
        }

        const { data: invitation, error } = (await supabaseServer
            .from("invitations")
            .select()
            .eq("id", invitation_id)
            .single()) as { data: Invitation; error: PostgrestError | null };

        if (error) {
            throw error;
        }

        let isMember = false;
        if (user_id) {
            const { count, error } = await supabaseServer
                .from("conversation_members")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user_id)
                .eq("conversation_id", invitation.conversation_id);

            if (error) {
                throw error;
            }

            isMember = !!count;
        }

        return nextResponse(
            { success: true, invitation: { ...invitation, isMember } },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

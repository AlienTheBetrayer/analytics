import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        // arguments and permissions
        const { type, id, user_id } = await request.json();
        console.log(type, id, user_id);

        if (!type || !id || !user_id) {
            console.error("type or id or user_id are missing");
            return nextResponse(
                { error: "type or id or user_id are missing" },
                400,
            );
        }

        tokenVerify(request, [user_id]);

        // queries
        switch (type) {
            case "like": {
                const { error } = await supabaseServer
                    .from("likes")
                    .upsert(
                        { post_id: id, user_id },
                        { onConflict: "user_id,post_id" },
                    );

                if (error) {
                    console.error(error);
                    return nextResponse({ error }, 400);
                }

                return nextResponse({ message: "Successfully liked!" }, 200);
            }
            case "unlike": {
                const { error } = await supabaseServer
                    .from("likes")
                    .delete()
                    .eq("user_id", user_id)
                    .eq("post_id", id);

                if (error) {
                    console.error(error);
                    return nextResponse({ error }, 400);
                }

                return nextResponse({ message: "Successfully unliked!" }, 200);
            }
            default: {
                console.error(
                    "type is incorrect. available types: [like, unlike]",
                );
                return nextResponse(
                    {
                        error: "type is incorrect. available types: [like, unlike]",
                    },
                    400,
                );
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ error: "Failed the like interaction." }, 400);
    }
};

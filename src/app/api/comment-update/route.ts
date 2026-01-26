import { supabaseServer } from "@/server/private/supabase";
import { Comment } from "@/types/tables/posts";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { type, user_id, post_id, comment_id, comment } =
            await request.json();

        if (!type || !user_id) {
            console.error("type and user_id have to be present");
            return nextResponse(
                { message: "type and user_id have to be present" },
                400,
            );
        }

        // permissions & privacy
        tokenVerify(request, [user_id]);

        // picking query
        switch (type) {
            case "delete": {
                if (!comment_id) {
                    console.error("comment_id are required for edit");
                    return nextResponse(
                        {
                            error: "comment_id are required for edit",
                        },
                        400,
                    );
                }

                const { data, error } = await supabaseServer
                    .from("comments")
                    .delete()
                    .eq("id", comment_id)
                    .select()
                    .single();

                if (error) {
                    console.error(error);
                    return nextResponse(error, 400);
                }

                return nextResponse(
                    {
                        message: "Successfully deleted a comment!",
                        comment: data,
                    },
                    200,
                );
            }
            case "send": {
                if (!comment || !post_id) {
                    console.error(
                        "comment and post_id are required for send/edit",
                    );
                    return nextResponse(
                        {
                            error: "comment and post_id are required for send/edit",
                        },
                        400,
                    );
                }

                const { data, error } = (await supabaseServer
                    .from("comments")
                    .insert({ post_id, user_id, comment })
                    .select()
                    .single()) as {
                    data: Comment;
                    error: PostgrestError | null;
                };

                if (error) {
                    console.error(error);
                    return nextResponse(error, 400);
                }

                return nextResponse(
                    {
                        message: "Successfully sent the comment!",
                        comment: data,
                    },
                    200,
                );
            }
            case "edit": {
                if (!comment || !comment_id) {
                    console.error(
                        "comment and comment_id are required for edit",
                    );
                    return nextResponse(
                        {
                            error: "comment and comment_id are required for edit",
                        },
                        400,
                    );
                }

                const { data, error } = (await supabaseServer
                    .from("comments")
                    .update({
                        comment,
                        edited_at: new Date().toISOString(),
                    })
                    .eq("id", comment_id)
                    .select()
                    .single()) as {
                    data: Comment;
                    error: PostgrestError | null;
                };

                if (error) {
                    console.error(error);
                    return nextResponse(error, 400);
                }

                return nextResponse(
                    {
                        message: "Successfully edited the comment!",
                        comment: data,
                    },
                    200,
                );
            }
            default: {
                console.error(
                    "wrong type, available types: [delete, edit, send]",
                );
                return nextResponse(
                    {
                        error: "wrong type, available types: [delete, edit, send]",
                    },
                    400,
                );
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ error: "Failed the comment operation." }, 400);
    }
};

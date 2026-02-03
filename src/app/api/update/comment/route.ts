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
            throw "type and user_id are undefined";
        }

        // permissions & privacy
        tokenVerify({ request, id: [user_id] });

        // picking query
        switch (type) {
            case "delete": {
                if (!comment_id) {
                    throw "comment_id is undefined";
                }

                const { data, error } = await supabaseServer
                    .from("comments")
                    .delete()
                    .eq("id", comment_id)
                    .select()
                    .single();

                if (error) {
                    throw error;
                }

                return nextResponse({ success: true, comment: data }, 200);
            }
            case "send": {
                if (!comment || !post_id) {
                    throw "comment and post_id are undefined";
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
                    throw error;
                }

                return nextResponse({ success: true, comment: data }, 200);
            }
            case "edit": {
                if (!comment || !comment_id) {
                    throw "comment and comment_id are undefined";
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
                    throw error;
                }

                return nextResponse({ success: true, comment: data }, 200);
            }
            default: {
                throw "wrong type";
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

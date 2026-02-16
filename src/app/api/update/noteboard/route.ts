import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { type, user_id, noteboard_id, title, description, pinned } =
            await request.json();

        if (!type || !user_id) {
            throw "user_id and type are undefined";
        }

        tokenVerify({ request, id: [user_id] });

        switch (type) {
            case "create": {
                const { error } = await supabaseServer
                    .from("noteboards")
                    .insert({ user_id, title, description });

                if (error) {
                    throw error;
                }

                return nextResponse({ success: true }, 200);
            }
            case "edit": {
                if (!noteboard_id) {
                    throw "noteboard_id is undefined";
                }

                const { error } = await supabaseServer
                    .from("noteboards")
                    .update({
                        ...(typeof title === "string" && { title }),
                        ...(typeof description === "string" && { description }),
                        ...(typeof pinned === "boolean" && {
                            pinned,
                            pinned_at: new Date().toISOString(),
                        }),
                        edited_at: new Date().toISOString(),
                    })
                    .eq("id", noteboard_id);

                if (error) {
                    throw error;
                }

                return nextResponse({ success: true }, 200);
            }
            default: {
                throw "type is invalid. available: create/edit";
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

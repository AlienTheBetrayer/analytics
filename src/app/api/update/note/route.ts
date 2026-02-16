import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const {
            type,
            user_id,
            noteboard_id,
            element_id,
            title,
            checked,
            pinned,
        } = await request.json();

        if (!type || !user_id) {
            throw "type and user_id are undefined";
        }

        tokenVerify({ request, id: [user_id] });

        switch (type) {
            case "create": {
                if (!title || !noteboard_id) {
                    throw "title and noteboard_id are undefined";
                }

                const { error } = await supabaseServer
                    .from("noteboard_elements")
                    .insert({
                        noteboard_id,
                        user_id,
                        title,
                    });

                if (error) {
                    throw error;
                }

                return nextResponse({ success: true }, 200);
            }
            case "edit": {
                if (!element_id) {
                    throw "element_is is undefined";
                }

                const { error } = await supabaseServer
                    .from("noteboard_elements")
                    .update({
                        title,
                        edited_at: new Date().toISOString(),
                        ...(typeof checked === "boolean" && { checked }),
                        ...(typeof pinned === "boolean" && {
                            pinned,
                            pinned_at: new Date().toISOString(),
                        }),
                    })
                    .eq("id", element_id);

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

import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { type, message_id, user_id, data } = await request.json();

        if (!type) {
            throw "type is undefined. available: send/edit";
        }

        if (!user_id) {
            throw "user_id is undefined";
        }

        switch (type) {
            case "send": {
                if (!data || !data.title || !data.email || !data.message) {
                    throw "data is undefined";
                }

                const { error } = await supabaseServer
                    .from("contact_messages")
                    .insert({ user_id, ...data });

                if (error) {
                    throw error;
                }
                break;
            }
            case "edit": {
                if (!data) {
                    throw "data is undefined";
                }

                if (!message_id) {
                    throw "message_id is undefined";
                }

                const { error } = await supabaseServer
                    .from("contact_messages")
                    .update({ ...data, edited_at: new Date().toISOString() })
                    .eq("user_id", user_id);

                if (error) {
                    throw error;
                }
                break;
            }
            default: {
                throw "type is wrong. available: send/edit";
            }
        }

        return nextResponse({ success: true }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

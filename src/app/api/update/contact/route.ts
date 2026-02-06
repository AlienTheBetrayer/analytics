import { supabaseServer } from "@/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const { type, message_id, user_id, data } = await request.json();

        if (!type) {
            throw "type is undefined. available: send/edit";
        }

        switch (type) {
            case "send": {
                if (!user_id) {
                    throw "user_id is undefined";
                }

                if (!data || !data.title || !data.email || !data.message) {
                    throw "data is undefined";
                }

                const { data: message, error } = await supabaseServer
                    .from("contact_messages")
                    .insert({ user_id, ...data })
                    .select()
                    .single();

                if (error) {
                    throw error;
                }

                return nextResponse({ success: true, message }, 200);
            }
            case "edit": {
                if (!data) {
                    throw "data is undefined";
                }

                if (!message_id) {
                    throw "message_id is undefined";
                }

                const { data: message, error } = await supabaseServer
                    .from("contact_messages")
                    .update({
                        ...data,
                        ...(!("response" in data) && {
                            edited_at: new Date().toISOString(),
                        }),
                    })
                    .eq("id", message_id)
                    .select()
                    .single();

                if (error) {
                    throw error;
                }

                return nextResponse({ success: true, message }, 200);
            }
            default: {
                throw "type is wrong. available: send/edit";
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

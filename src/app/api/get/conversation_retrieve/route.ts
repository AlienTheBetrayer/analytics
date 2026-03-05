import { supabaseServer } from "@/utils/server/private/supabase";
import { nextResponse } from "@/utils/api/response";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = request.nextUrl;
        const type = searchParams.get("type");
        const status_id = searchParams.get("status_id");
        const what = searchParams.get("what");

        if (!type || !status_id) {
            throw "type and status_id are undefined";
        }

        tokenVerify({ request, id: [status_id] });

        switch (type) {
            case "u": {
                if (!what) {
                    throw "what is undefined";
                }

                const { data: user, error: idError } = await supabaseServer
                    .from("users")
                    .select("*, profile:profiles(*)")
                    .eq("username", what)
                    .single();

                if (idError) {
                    throw idError;
                }

                const { data, error } = await supabaseServer
                    .from("conversation_members")
                    .select(
                        "conversation_id, user_id, conversation:conversations!inner(type)",
                    )
                    .in("user_id", [status_id, user?.id])
                    .eq("conversation.type", "dm");

                if (error) {
                    throw error;
                }

                return nextResponse(
                    {
                        success: true,
                        conversation_id:
                            data.find((d) => d.user_id === user?.id)
                                ?.conversation_id ?? null,
                        user,
                    },
                    200,
                );
            }
            case "notes": {
                const { data, error } = await supabaseServer
                    .from("conversations")
                    .select(
                        "id, conversation_members:conversation_members!inner(user_id)",
                    )
                    .eq("conversation_members.user_id", status_id)
                    .eq("type", "notes");

                if (error) {
                    throw error;
                }

                return nextResponse(
                    {
                        success: true,
                        conversation_id: data[0]?.id ?? null,
                    },
                    200,
                );
            }
            default: {
                throw "wrong type. available: u/notes";
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

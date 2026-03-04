import { supabaseServer } from "@/server/private/supabase";
import { ConversationMember } from "@/types/tables/messages";
import { nextResponse } from "@/utils/api/response";
import { tokenPayload } from "@/utils/auth/tokenPayload";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const json = await request.json();
        const { type, user_ids, conversation_id } = json;

        if (!type || !conversation_id || !user_ids) {
            throw "type and conversation_id and user_ids are undefined";
        }

        if (!Array.isArray(user_ids)) {
            throw "user_ids is not an array";
        }

        // permissions
        if (type === "kick" || type === "permissions") {
            handlePermissions(request, json);
        }

        switch (type) {
            case "add": {
                return await modifyAdd(json);
            }
            case "kick": {
                return await modifyKick(json);
            }
            case "permissions": {
                return await modifyPermissions(json);
            }
            default: {
                throw "type is invalid. available: add/kick/permissions";
            }
        }
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};

const handlePermissions = async (
    request: NextRequest,
    json: Record<string, unknown>,
) => {
    const { user_ids, conversation_id, is_admin } = json as {
        user_ids: string[];
    } & typeof json;

    const token = tokenPayload(request)?.accessToken;

    if (!token) {
        throw "unauthenticated";
    }

    const { data: changer, error: errorChanger } = (await supabaseServer
        .from("conversation_members")
        .select()
        .eq("conversation_id", conversation_id)
        .eq("user_id", token.id)
        .single()) as {
        data: ConversationMember;
        error: PostgrestError | null;
    };

    if (errorChanger) {
        throw errorChanger;
    }

    // 1. user is a regular user
    if (!changer.is_admin && !changer.is_founder) {
        throw "lacking permissions";
    }

    // 2. user is a founder = allow everything
    if (changer.is_founder) {
        return;
    }

    const { data: subjects, error: subjectsError } = (await supabaseServer
        .from("conversation_members")
        .select()
        .eq("conversation_id", conversation_id)
        .in("user_id", [user_ids])) as {
        data: ConversationMember[];
        error: PostgrestError | null;
    };

    if (subjectsError) {
        throw subjectsError;
    }

    // 3. non-founder trying to modify a founder
    if (!changer.is_founder && subjects.some((s) => s.is_founder)) {
        throw "lacking permissions";
    }

    // 4. admin is trying to modify another admin
    if (changer.is_admin && subjects.some((s) => s.is_admin)) {
        throw "lacking permissions";
    }

    // 5. non-admin trying to modify an admin
    if (
        !changer.is_admin &&
        !changer.is_founder &&
        subjects.some((s) => s.is_admin)
    ) {
        throw "lacking permissions";
    }

    // 6. trying to grant/revoke permissions not being a founder
    if (!changer.is_founder && typeof is_admin === "boolean") {
        throw "lacking permissions";
    }
};

const modifyPermissions = async (json: Record<string, unknown>) => {
    const {
        user_ids,
        conversation_id,
        can_read,
        can_send,
        can_delete_messages,
        can_kick,
        can_invite,
        is_admin,
    } = json;

    if (!Array.isArray(user_ids)) {
        throw "user_ids is not an array";
    }

    const { error } = await supabaseServer
        .from("conversation_members")
        .update({
            ...(typeof can_read === "boolean" && { can_read }),
            ...(typeof can_send === "boolean" && { can_send }),
            ...(typeof can_kick === "boolean" && { can_kick }),
            ...(typeof can_delete_messages === "boolean" && {
                can_delete_messages,
            }),
            ...(typeof can_invite === "boolean" && { can_invite }),
            ...(typeof is_admin === "boolean" && { is_admin }),
        })
        .eq("conversation_id", conversation_id)
        .in("user_id", user_ids);

    if (error) {
        throw error;
    }

    return nextResponse({ success: true }, 200);
};

const modifyAdd = async (json: Record<string, unknown>) => {
    const { user_ids, conversation_id } = json as {
        user_ids: string[];
    } & typeof json;

    // the actual members
    {
        const { error } = await supabaseServer
            .from("conversation_members")
            .insert(
                (user_ids as string[]).map((user_id) => ({
                    conversation_id,
                    user_id,
                })),
            );

        if (error) {
            throw error;
        }
    }

    // get usernames for a system message
    const { data: usernames, error } = await supabaseServer
        .from("users")
        .select("username")
        .in("id", user_ids);

    if (error) {
        throw error;
    }

    // system message
    {
        const { error } = await supabaseServer.from("messages").insert({
            message:
                user_ids.length > 10
                    ? `${user_ids.length} users have joined!`
                    : `${usernames.map((u) => u.username).join(", ")} ${user_ids.length > 1 ? "have" : "has"} joined!`,
            type: "system",
            conversation_id,
            user_id: null,
        });

        if (error) {
            throw error;
        }
    }

    return nextResponse({ success: true }, 200);
};

const modifyKick = async (json: Record<string, unknown>) => {
    const { user_ids, conversation_id } = json as {
        user_ids: string[];
    } & typeof json;

    {
        const { error } = await supabaseServer
            .from("conversation_members")
            .delete()
            .eq("conversation_id", conversation_id)
            .in("user_id", user_ids);

        if (error) {
            throw error;
        }
    }

    // get usernames for a system message
    const { data: usernames, error } = await supabaseServer
        .from("users")
        .select("username")
        .in("id", user_ids);

    if (error) {
        throw error;
    }

    // system message
    {
        const { error } = await supabaseServer.from("messages").insert({
            message:
                user_ids.length > 10
                    ? `${user_ids.length} users have been kicked`
                    : `${usernames.map((u) => u.username).join(", ")} ${user_ids.length > 1 ? "have" : "has"} been kicked`,
            type: "system",
            conversation_id,
            user_id: null,
        });

        if (error) {
            throw error;
        }
    }

    return nextResponse({ success: true }, 200);
};

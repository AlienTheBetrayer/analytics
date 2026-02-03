import "server-only";
import { NextRequest } from "next/server";
import { supabaseServer } from "@/server/private/supabase";
import { tokenVerify } from "../auth/tokenVerify";
import { nextResponse } from "./response";

/**
 * unfriends everyone
 * @param request next.js request
 * @returns
 */
export const unfriendAll = async (request: NextRequest, from_id: string) => {
    if (!from_id) {
        throw "from_id is undefined";
    }

    tokenVerify({ request, id: [from_id] });

    const { error } = await supabaseServer
        .from("friends")
        .delete()
        .or(`user1_id.eq.${from_id},user2_id.eq.${from_id}`);

    if (error) {
        throw error;
    }

    return nextResponse({ success: true }, 200, "all_unfriended");
};

/**
 * unfriends two users
 * @param request next.js request
 * @returns
 */
export const unfriend = async (
    request: NextRequest,
    from_id: string,
    to_id?: string,
) => {
    if (!from_id || !to_id) {
        throw "from_id and to_id are undefined";
    }

    tokenVerify({ request, id: [from_id] });

    const { error } = await supabaseServer
        .from("friends")
        .delete()
        .or(
            `and(user1_id.eq.${from_id},user2_id.eq.${to_id}),and(user1_id.eq.${to_id},user2_id.eq.${from_id})`,
        );

    if (error) {
        throw error;
    }

    return nextResponse(
        { message: "Successfully unfriended the user!" },
        200,
        "unfriended",
    );
};

/**
 * sends a friend request
 * @param request next.js request
 */
export const requestSend = async (
    request: NextRequest,
    from_id: string,
    to_id?: string,
) => {
    if (!from_id || !to_id) {
        throw "from_id and to_id are undefined";
    }

    if (from_id === to_id) {
        throw "you cannot send a friend request to yourself";
    }

    tokenVerify({ request, id: [from_id] });

    const { data: alreadyData, error: alreadyError } = await supabaseServer
        .from("friends")
        .select()
        .or(
            `and(user1_id.eq.${from_id},user2_id.eq.${to_id}),and(user1_id.eq.${to_id},user2_id.eq.${from_id})`,
        )
        .limit(1);

    if (alreadyError) {
        throw alreadyError;
    }

    if (alreadyData.length > 0) {
        throw "you are already friends";
    }

    const { data: fromRequestData, error: fromRequestError } =
        await supabaseServer
            .from("friend_requests")
            .select()
            .eq("from_id", from_id)
            .eq("to_id", to_id)
            .limit(1);

    if (fromRequestError) {
        throw fromRequestError;
    }

    if (fromRequestData.length > 0) {
        throw "friend request had already been sent";
    }

    const { error: sendRequestError } = await supabaseServer
        .from("friend_requests")
        .insert({ from_id, to_id });

    if (sendRequestError) {
        throw sendRequestError;
    }

    return nextResponse({ success: true }, 200, "friend_request_sent");
};

/**
 * rejects a friend request
 * @param request next.js request
 */
export const requestReject = async (
    request: NextRequest,
    from_id: string,
    to_id?: string,
) => {
    if (!from_id || !to_id) {
        throw "from_id and to_id are undefined";
    }

    tokenVerify({ request, id: [from_id] });

    const { error } = await supabaseServer
        .from("friend_requests")
        .delete()
        .or(
            `and(from_id.eq.${from_id},to_id.eq.${to_id}),and(from_id.eq.${to_id},to_id.eq.${from_id})`,
        );

    if (error) {
        throw error;
    }

    return nextResponse({ success: true }, 200, "friend_request_rejected");
};

/**
 * accepts a friend request
 * @param request next.js request
 */
export const requestAccept = async (
    request: NextRequest,
    from_id: string,
    to_id?: string,
) => {
    if (!from_id || !to_id) {
        throw "from_id and to_id are undefined";
    }

    tokenVerify({ request, id: [from_id] });

    const { data: toRequestData, error: toRequestError } = await supabaseServer
        .from("friend_requests")
        .select()
        .eq("to_id", from_id)
        .limit(1);

    if (toRequestError) {
        throw toRequestError;
    }

    if (!toRequestData.length) {
        throw "no requests sent";
    }

    const { error: acceptRequestError } = await supabaseServer
        .from("friend_requests")
        .delete()
        .eq("to_id", from_id);

    if (acceptRequestError) {
        throw acceptRequestError;
    }

    const { error: friendError } = await supabaseServer
        .from("friends")
        .insert({ user1_id: from_id, user2_id: to_id });

    if (friendError) {
        throw friendError;
    }

    return nextResponse({ success: true }, 200, "friend_request_accepted");
};

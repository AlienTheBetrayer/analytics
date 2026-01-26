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
        console.error("from_id is missing.");
        return nextResponse({ error: "from_id is missing." }, 400);
    }

    tokenVerify(request, [from_id]);

    const { error: unfriendError } = await supabaseServer
        .from("friends")
        .delete()
        .or(`user1_id.eq.${from_id},user2_id.eq.${from_id}`);

    if (unfriendError) {
        console.error(unfriendError);
        return nextResponse(unfriendError, 400);
    }

    return nextResponse(
        { message: "Successfully unfriended everyone" },
        200,
        "all_unfriended",
    );
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
        console.error("from_id and to_id are missing.");
        return nextResponse({ error: "from_id and to_id are missing." }, 400);
    }

    tokenVerify(request, [from_id]);

    const { error: unfriendError } = await supabaseServer
        .from("friends")
        .delete()
        .or(
            `and(user1_id.eq.${from_id},user2_id.eq.${to_id}),and(user1_id.eq.${to_id},user2_id.eq.${from_id})`,
        );

    if (unfriendError) {
        console.error(unfriendError);
        return nextResponse(unfriendError, 400);
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
        console.error("from_id and to_id are missing.");
        return nextResponse({ error: "from_id and to_id are missing." }, 400);
    }

    if (from_id === to_id) {
        console.error("you cannot send a friend request to yourself.");
        return nextResponse(
            { error: "you cannot send a friend request to yourself." },
            400,
        );
    }

    tokenVerify(request, [from_id]);

    const { data: alreadyData, error: alreadyError } = await supabaseServer
        .from("friends")
        .select()
        .or(
            `and(user1_id.eq.${from_id},user2_id.eq.${to_id}),and(user1_id.eq.${to_id},user2_id.eq.${from_id})`,
        )
        .limit(1);

    if (alreadyError) {
        console.error(alreadyError);
        return nextResponse(alreadyError, 400);
    }

    if (alreadyData.length > 0) {
        console.error("You are already friends with this user.");
        return nextResponse(
            { error: "You are already friends with this user." },
            400,
            "friends_already",
        );
    }

    const { data: fromRequestData, error: fromRequestError } =
        await supabaseServer
            .from("friend_requests")
            .select()
            .eq("from_id", from_id)
            .eq("to_id", to_id)
            .limit(1);

    if (fromRequestError) {
        console.error(fromRequestError);
        return nextResponse(fromRequestError, 400);
    }

    if (fromRequestData.length > 0) {
        console.error("The friend request had already been sent.");
        return nextResponse(
            { error: "The friend request had already been sent." },
            400,
            "friend_request_already_sent",
        );
    }

    const { error: sendRequestError } = await supabaseServer
        .from("friend_requests")
        .insert({ from_id, to_id });

    if (sendRequestError) {
        console.error(sendRequestError);
        return nextResponse(sendRequestError, 400);
    }

    return nextResponse(
        { message: "Successfully sent a friend request!" },
        200,
        "friend_request_sent",
    );
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
        console.error("from_id and to_id are missing.");
        return nextResponse({ error: "from_id and to_id are missing." }, 400);
    }

    tokenVerify(request, [from_id]);

    const { error } = await supabaseServer
        .from("friend_requests")
        .delete()
        .or(
            `and(from_id.eq.${from_id},to_id.eq.${to_id}),and(from_id.eq.${to_id},to_id.eq.${from_id})`,
        );

    if (error) {
        console.error(error);
        return nextResponse(
            { error: "Failed rejecting a friend request." },
            400,
        );
    }

    return nextResponse(
        { message: "Successfully rejected a friend request!" },
        200,
        "friend_request_rejected",
    );
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
        console.error("from_id and to_id are missing.");
        return nextResponse({ error: "from_id and to_id are missing." }, 400);
    }

    tokenVerify(request, [from_id]);

    const { data: toRequestData, error: toRequestError } = await supabaseServer
        .from("friend_requests")
        .select()
        .eq("to_id", from_id)
        .limit(1);

    if (toRequestError) {
        console.error(toRequestError);
        return nextResponse(toRequestError, 400);
    }

    if (!toRequestData.length) {
        console.error("No requests sent.");
        return nextResponse({ error: "No requests sent." }, 400);
    }

    const { error: acceptRequestError } = await supabaseServer
        .from("friend_requests")
        .delete()
        .eq("to_id", from_id);

    if (acceptRequestError) {
        console.error(acceptRequestError);
        return nextResponse(acceptRequestError, 400);
    }

    const { error: friendError } = await supabaseServer
        .from("friends")
        .insert({ user1_id: from_id, user2_id: to_id });

    if (friendError) {
        console.error(friendError);
        return nextResponse(friendError, 400);
    }

    return nextResponse(
        { message: "Friend request accepted!" },
        200,
        "friend_request_accepted",
    );
};

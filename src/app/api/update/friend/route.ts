import type { NextRequest } from "next/server";
import { nextResponse } from "@/utils/api/response";
import {
    requestAccept,
    requestReject,
    requestSend,
    unfriend,
    unfriendAll,
} from "@/utils/api/friend";

export const POST = async (request: NextRequest) => {
    try {
        const {
            from_id,
            to_id,
            type,
        }: {
            from_id: string;
            to_id?: string;
            type:
                | "request-send"
                | "request-accept"
                | "request-reject"
                | "unfriend"
                | "unfriend-all";
        } = await request.json();

        switch (type) {
            case "request-accept": {
                return await requestAccept(request, from_id, to_id);
            }
            case "request-reject": {
                return await requestReject(request, from_id, to_id);
            }
            case "request-send": {
                return await requestSend(request, from_id, to_id);
            }
            case "unfriend": {
                return await unfriend(request, from_id, to_id);
            }
            case "unfriend-all": {
                return await unfriendAll(request, from_id);
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

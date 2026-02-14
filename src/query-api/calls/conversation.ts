import { queryInvalidate } from "@/query/auxiliary";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const createConversation = async (options: {
    user_id: string;
    type: "notes" | "dm" | "group" | "channel";
    member_ids: string[];
    title?: string;
    description?: string;
}) => {
    const res = await refreshedRequest({
        route: "/api/update/conversation-create",
        method: "POST",
        body: {
            user_id: options.user_id,
            type: options.type,
            member_ids: options.member_ids.join(","),
            ...("title" in options && { title: options.title }),
            ...("description" in options && {
                description: options.description,
            }),
        },
    });

    queryInvalidate({ key: ["conversations", options.user_id] });

    return res;
};

export const deleteConversation = async (options: {
    user_id: string;
    conversation_id: string;
    type: "leave" | "delete-all";
}) => {
    const res = await refreshedRequest({
        route: "/api/delete/conversation",
        method: "POST",
        body: {
            ...options,
        },
    });

    queryInvalidate({ key: ["conversations", options.user_id] });

    return res;
};

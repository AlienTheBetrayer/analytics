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
            ...options,
        },
    });

    queryInvalidate({ key: ["conversations", options.user_id] });

    return res;
};

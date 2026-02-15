import { queryInvalidate, queryMutate } from "@/query/auxiliary";
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

export const updateConversation = async (options: {
    conversation_id: string;
    user_id: string;
    title?: string;
    description?: string;
    pinned?: boolean;
    archived?: boolean;
}) => {
    queryMutate({
        key: ["conversations", options.user_id],
        value: (state) =>
            state.map((s) =>
                s.id === options.conversation_id
                    ? {
                          ...s,
                          ...(typeof options.title === "string" && {
                              title: options.title,
                          }),
                          ...(typeof options.description === "string" && {
                              description: options.description,
                          }),
                          conversation_meta: {
                              ...s.conversation_meta,
                              ...(typeof options.pinned === "boolean" && {
                                  pinned: options.pinned,
                              }),
                              ...(typeof options.archived === "boolean" && {
                                  archived: options.archived,
                              }),
                          },
                      }
                    : s,
            ),
    });

    const res = await refreshedRequest({
        route: "/api/update/conversation",
        method: "POST",
        body: {
            ...options,
        },
    });

    return res;
};

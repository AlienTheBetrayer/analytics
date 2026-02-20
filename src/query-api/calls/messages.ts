/* eslint-disable @typescript-eslint/no-unused-vars */
import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryInvalidate, queryMutate } from "@/query/auxiliary";
import { Conversation, Message } from "@/types/tables/messages";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const upsertMessage = async (
    options: (
        | { type: "start_dm"; to_id: string; message: string }
        | { type: "send"; conversation_id: string; message: string }
        | {
              type: "edit";
              conversation_id: string;
              message_id: string;
              message?: string;
          }
    ) & { user: CacheAPIProtocol["status"]["data"] },
) => {
    // request
    let message: Message & {
        conversation: Conversation;
    };

    switch (options.type) {
        case "start_dm": {
            const res = await refreshedRequest({
                route: "/api/update/message",
                method: "POST",
                body: {
                    type: "send",
                    from_id: options.user.id,
                    to_id: options.to_id,
                    message: options.message,
                },
            });

            message = res.data.message;

            if (!message) {
                break;
            }

            const { conversation, ...msg } = message;

            queryInvalidate({ key: ["conversations", options.user.id] });
            queryMutate({
                key: ["messages", message.conversation.id],
                value: (state) => ({
                    ...state,
                    messages: [
                        ...(state?.messages ?? []),
                        {
                            ...msg,
                            user: {
                                ...options.user.user,
                                profile: options.user.profile,
                            },
                        },
                    ],
                }),
            });
            break;
        }
        case "send": {
            const temp = crypto.randomUUID();
            queryMutate({
                key: ["messages", options.conversation_id],
                value: (state) => ({
                    ...state,
                    messages: [
                        ...(state?.messages ?? []),
                        {
                            conversation_id: options.conversation_id,
                            user_id: options.user.id,
                            created_at: new Date().toISOString(),
                            message: options.message,
                            id: `temp${temp}`,
                            type: "loading",
                            user: {
                                ...options.user.user,
                                profile: options.user.profile,
                            },
                        },
                    ],
                }),
            });

            const res = await refreshedRequest({
                route: "/api/update/message",
                method: "POST",
                body: {
                    type: "send",
                    from_id: options.user.id,
                    conversation_id: options.conversation_id,
                    message: options.message,
                },
            });

            message = res.data.message;

            if (!message) {
                break;
            }

            const { conversation, ...msg } = message;

            queryMutate({
                key: ["messages", message.conversation.id],
                value: (state) => ({
                    ...state,
                    messages: state.messages.map((m) =>
                        m.id === `temp${temp}`
                            ? { ...m, id: msg.id, type: "msg" }
                            : m,
                    ),
                }),
            });
            break;
        }
        case "edit": {
            queryMutate({
                key: ["messages", options.conversation_id],
                value: (state) => ({
                    ...state,
                    messages: state.messages.map((m) =>
                        m.id === options.message_id
                            ? {
                                  ...m,
                                  ...("message" in options && {
                                      message: options.message,
                                      edited_at: new Date().toISOString(),
                                  }),
                              }
                            : m,
                    ),
                }),
            });

            const res = await refreshedRequest({
                route: "/api/update/message",
                method: "POST",
                body: {
                    type: "edit",
                    from_id: options.user.id,
                    message_id: options.message_id,
                },
            });

            message = res.data.message;
            break;
        }
    }

    queryMutate({
        key: ["conversations", options.user.id],
        value: (state) =>
            state.map((c) =>
                c.id === message.conversation_id
                    ? { ...c, last_message: message }
                    : c,
            ),
    });

    return message;
};

export const deleteMessage = async (options: {
    message: CacheAPIProtocol["messages"]["data"]["messages"][number];
}) => {
    let lastMessage:
        | CacheAPIProtocol["messages"]["data"]["messages"][number]
        | undefined = undefined;

    queryMutate({
        key: ["messages", options.message.conversation_id],
        value: (state) => ({
            ...state,
            messages: state.messages.filter((m, idx, arr) => {
                const is = m.id !== options.message.id;
                if (!is && idx > 0) {
                    lastMessage = arr[idx - 1];
                }

                return is;
            }),
        }),
    });

    queryMutate({
        key: ["conversations", options.message.user.id],
        value: (state) =>
            state.map((c) =>
                c.id === options.message.conversation_id
                    ? { ...c, last_message: lastMessage }
                    : c,
            ),
    });

    const res = await refreshedRequest({
        method: "POST",
        route: "/api/delete/message",
        body: {
            message_id: options.message.id,
            user_id: options.message.user.id,
        },
    });

    return res;
};

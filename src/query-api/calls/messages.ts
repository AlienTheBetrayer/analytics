/* eslint-disable @typescript-eslint/no-unused-vars */
import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryInvalidate, queryMutate } from "@/query/auxiliary";
import { queryCache } from "@/query/init";
import { Conversation, Message } from "@/types/tables/messages";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const upsertMessage = async (
    options: (
        | { type: "start_dm"; to_id: string; message: string }
        | {
              type: "send";
              conversation_id: string;
              message: string;
              message_type?: Message["type"];
              reply?: CacheAPIProtocol["messages"]["data"][number];
          }
        | {
              type: "edit";
              message: CacheAPIProtocol["messages"]["data"][number];
              content?: string;
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

            if (conversation.type === "notes") {
                queryMutate({
                    key: [
                        "conversation_retrieve",
                        "notes",
                        options.user.id,
                        null,
                    ],
                    value: (state) => ({
                        ...state,
                        conversation_id: msg.conversation_id,
                    }),
                });
            }

            queryMutate({
                key: ["messages", msg.conversation_id],
                value: (state) => [
                    ...(state ?? []),
                    {
                        ...msg,
                        user: {
                            ...options.user.user,
                            profile: options.user.profile,
                        },
                    },
                ],
            });

            queryInvalidate({ key: ["conversations", options.user.id] });
            break;
        }
        case "send": {
            // temp message
            const temp = crypto.randomUUID();
            queryMutate({
                key: ["messages", options.conversation_id],
                value: (state) => [
                    ...(state ?? []),
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
            });

            const res = await refreshedRequest({
                route: "/api/update/message",
                method: "POST",
                body: {
                    type: "send",
                    from_id: options.user.id,
                    conversation_id: options.conversation_id,
                    message: options.message,
                    ...(options.reply && { reply: options.reply }),
                },
            });

            message = res.data.message;

            if (!message) {
                break;
            }

            const { conversation, ...msg } = message;

            // replacing temp message
            queryMutate({
                key: ["messages", message.conversation.id],
                value: (state) =>
                    state.map((m) =>
                        m.id === `temp${temp}`
                            ? { ...m, id: msg.id, type: msg.type }
                            : m,
                    ),
            });
            break;
        }
        case "edit": {
            queryMutate({
                key: ["messages", options.message.conversation_id],
                value: (state) =>
                    state.map((m) =>
                        m.id === options.message.id
                            ? {
                                  ...m,
                                  ...("content" in options && {
                                      message: options.content,
                                      edited_at: new Date().toISOString(),
                                  }),
                              }
                            : m,
                    ),
            });

            const res = await refreshedRequest({
                route: "/api/update/message",
                method: "POST",
                body: {
                    type: "edit",
                    from_id: options.user.id,
                    message_id: options.message.id,
                    message: options.content,
                },
            });

            message = res.data.message;
            break;
        }
    }

    // last message
    queryMutate({
        key: ["conversations", options.user.id],
        value: (state) =>
            state?.map((c) =>
                c.id === message.conversation_id
                    ? {
                          ...c,
                          last_message: {
                              ...message,
                              user: {
                                  ...options.user.user,
                                  profile: options.user.profile,
                              },
                          },
                      }
                    : c,
            ),
    });

    return message;
};

export const deleteMessage = async (options: {
    message: CacheAPIProtocol["messages"]["data"][number];
}) => {
    queryMutate({
        key: ["messages", options.message.conversation_id],
        value: (state) => state.filter((m) => m.id !== options.message.id),
    });

    queryMutate({
        key: ["conversations", options.message.user.id],
        value: (state) =>
            state.map((c) =>
                c.id === options.message.conversation_id
                    ? {
                          ...c,
                          last_message: (
                              queryCache.get({
                                  key: [
                                      "messages",
                                      options.message.conversation_id,
                                  ],
                              }) as CacheAPIProtocol["messages"]["data"]
                          )?.at(-1),
                      }
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

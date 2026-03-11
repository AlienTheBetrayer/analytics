/**
 * eslint-disable @typescript-eslint/no-unused-vars
 *
 * @format
 */

import { CacheAPIProtocol } from "@/query-api/protocol";
import { ExpandedMessage } from "@/query-api/protocol/messages";
import { queryInvalidate, queryMutate } from "@/query/auxiliary";
import { queryCache } from "@/query/init";
import { MapType } from "@/types/other/utils";
import { Conversation, Message } from "@/types/tables/messages";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const setLastMessage = (user_id: string, conversation_id: string) => {
    queryMutate({
        key: ["conversations", user_id],
        value: (state) => {
            const conversations = new Map(state?.conversations ?? []);
            const c = conversations.get(conversation_id);

            if (!c) {
                return state;
            }

            const messages = queryCache.get({ key: ["messages", c.id] }) as CacheAPIProtocol["messages"]["data"];

            const lastMessageId = messages && messages.ids.at(-1);

            if (!lastMessageId) {
                return state;
            }

            const lastMessage = messages.messages.get(lastMessageId);

            if (!lastMessage) {
                return state;
            }

            const lastUser = messages.users.get(lastMessage.user_id);

            if (!lastUser) {
                return state;
            }

            conversations.set(conversation_id, { ...c, last_message: { ...lastMessage, user: lastUser } });

            return { ...state, conversations };
        },
    });
};

export const upsertMessage = async (
    options:
        | { type: "start_dm"; to_id: string; message: string }
        | {
              type: "send";
              conversation_id: string;
              message: string;
              message_type?: Message["type"];
              reply?: MapType<CacheAPIProtocol["messages"]["data"]["messages"]>;
              forward?: MapType<CacheAPIProtocol["messages"]["data"]["messages"]>;
          }
        | {
              type: "edit";
              message: MapType<CacheAPIProtocol["messages"]["data"]["messages"]>;
              content?: string;
          },
) => {
    const user = queryCache.get({ key: ["status"] }) as CacheAPIProtocol["status"]["data"];

    if (!user) {
        return;
    }

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
                    from_id: user.id,
                    to_id: options.to_id,
                    message: options.message,
                },
            });

            message = res.data.message;

            if (!message) {
                break;
            }

            queryInvalidate({
                key: ["conversations", user.id],
            });
            queryInvalidate({
                key: ["messages", message.conversation_id],
            });

            break;
        }
        case "send": {
            // temp message
            const temp = crypto.randomUUID();

            queryMutate({
                key: ["messages", options.conversation_id],
                value: (state) => {
                    const messages = new Map(state?.messages ?? []).set(`temp${temp}`, {
                        cid: temp,
                        conversation_id: options.conversation_id,
                        user_id: user.id,
                        created_at: new Date().toISOString(),
                        message: options.message,
                        id: `temp${temp}`,
                        type: "loading",
                        ...(options.reply && { reply: options.reply }),
                        ...(options.forward && { forward: options.forward }),
                    });


                    return { ...state, messages, ids: [...state.ids, `temp${temp}`] };
                },
            });

            const res = await refreshedRequest({
                route: "/api/update/message",
                method: "POST",
                body: {
                    type: "send",
                    from_id: user.id,
                    conversation_id: options.conversation_id,
                    message: options.message,
                    ...(options.message_type && {
                        message_type: options.message_type,
                    }),
                    ...(options.reply && { reply: options.reply }),
                    ...(options.forward && { forward: options.forward }),
                },
            });

            message = res.data.message;

            if (!message) {
                break;
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { conversation: _, ...msg } = message;

            queryMutate({
                key: ["messages", message.conversation_id],
                value: (state) => {
                    const m = state.messages.get(`temp${temp}`);

                    if (!m) {
                        return state;
                    }

                    const messages = new Map(state.messages);
                    messages.delete(`temp${temp}`);
                    messages.set(msg.id, {
                        ...m,
                        id: msg.id,
                        type: msg.type,
                    });

                    return {
                        ...state,
                        messages,
                        ids: state.ids.map((id) => (id === `temp${temp}` ? msg.id : id)),
                    };
                },
            });
            break;
        }
        case "edit": {
            queryMutate({
                key: ["messages", options.message.conversation_id],
                value: (state) => {
                    const m = state.messages.get(options.message.id);

                    if (!m) {
                        return state;
                    }

                    const messages = new Map(state.messages).set(options.message.id, {
                        ...m,
                        ...("content" in options && { message: options.content, edited_at: new Date().toISOString() }),
                    });

                    return { ...state, messages };
                },
            });

            const res = await refreshedRequest({
                route: "/api/update/message",
                method: "POST",
                body: {
                    type: "edit",
                    from_id: user.id,
                    message_id: options.message.id,
                    message: options.content,
                },
            });

            message = res.data.message;
            break;
        }
    }

    // last message
    setLastMessage(user.id, message.conversation_id);

    return message;
};

export const deleteMessage = async (options: { messages: string[]; conversation_id: string }) => {
    const user = queryCache.get({ key: ["status"] }) as CacheAPIProtocol["status"]["data"];

    if (!user) {
        return;
    }

    const queryMessages = queryCache.get({
        key: ["messages", options.conversation_id],
    }) as CacheAPIProtocol["messages"]["data"];
    const messages = options.messages.flatMap((id) =>
        queryMessages.messages.has(id) ? queryMessages.messages.get(id) : [],
    ) as ExpandedMessage[];

    const conversation = (
        queryCache.get({
            key: ["conversations", user.id],
        }) as CacheAPIProtocol["conversations"]["data"]
    ).conversations.get(options.conversation_id);

    if (!conversation || !messages?.length) {
        return;
    }

    const allowedMessages =
        (
            conversation.membership.can_delete_messages ||
            conversation.membership.is_admin ||
            conversation.membership.is_founder
        ) ?
            new Set(messages.map((m) => m.id))
        :   new Set(messages.flatMap((m) => (m.user_id === user.id || m.type === "system" ? m.id : [])));

    if (!allowedMessages.size) {
        return;
    }

    queryMutate({
        key: ["messages", options.conversation_id],
        value: (state) => {
            const messages = new Map(state.messages);

            for (const id of allowedMessages) {
                messages.delete(id);
            }

            return { ...state, messages, ids: state.ids.filter((id) => !allowedMessages.has(id)) };
        },
    });

    setLastMessage(user.id, options.conversation_id);

    const res = await refreshedRequest({
        method: "POST",
        route: "/api/delete/messages",
        body: {
            message_ids: messages.map((m) => m.id),
            user_id: user.id,
        },
    });

    return res;
};

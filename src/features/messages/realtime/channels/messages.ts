/* eslint-disable @typescript-eslint/no-unused-vars */
import { RealtimeBroadcastEvent } from "@/features/messages/realtime/useRealtime";
import { setLastMessage } from "@/query-api/calls/messages";
import { ReducedUser } from "@/query-api/protocol/messages";
import { queryMutate } from "@/query/auxiliary";
import { Message } from "@/types/tables/messages";

type PayloadMessage = Message & { user: ReducedUser };

export const handleRealtimeMessage = (
    user_id: string,
    response: {
        event: RealtimeBroadcastEvent;
        payload: PayloadMessage & { reply?: PayloadMessage; forward?: PayloadMessage };
    },
) => {
    const { event, payload } = response;

    if (!payload) {
        return;
    }

    // constructing an object
    let reply: Message | undefined = undefined;
    let forward: Message | undefined = undefined;
    const messageUsers: ReducedUser[] = [];
    const { user, ...message } = payload;

    if (!user || !message) {
        return;
    }

    // users
    messageUsers.push(user);

    if (message.reply) {
        const { user: msgUser, ...msg } = message.reply;
        messageUsers.push(msgUser);
        reply = msg;
    }

    if (message.forward) {
        const { user: msgUser, ...msg } = message.forward;
        messageUsers.push(msgUser);
        forward = msg;
    }

    switch (event) {
        case "INSERT": {
            queryMutate({
                key: ["messages", message.conversation_id],
                value: (state) => {
                    const messages = new Map(state?.messages ?? []);
                    let ids = state?.ids ?? [];

                    // deduplication
                    for (const [id, msg] of messages) {
                        if ((msg.user_id === message.user_id && msg.type === "loading") || id === message.id) {
                            return state;
                        }
                    }

                    ids = [...ids, message.id];

                    const users = new Map(state?.users ?? []);
                    messages.set(message.id, message);

                    if (messageUsers.length) {
                        for (const user of messageUsers) {
                            users.set(user.id, user);
                        }
                    }

                    return { ...state, messages, users, ids };
                },
            });
            break;
        }
        case "DELETE": {
            queryMutate({
                key: ["messages", message.conversation_id],
                value: (state) => {
                    const messages = new Map(state?.messages ?? []);
                    messages.delete(message.id);

                    return { ...state, messages, ids: state.ids.filter((id) => id !== message.id) };
                },
            });
            break;
        }
        case "UPDATE": {
            queryMutate({
                key: ["messages", message.conversation_id],
                value: (state) => {
                    const messages = new Map(state?.messages ?? []);
                    messages.set(message.id, message);

                    return { ...state, messages };
                },
            });
            break;
        }
    }

    setLastMessage(user_id, message.conversation_id);
};

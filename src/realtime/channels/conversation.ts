import { queryMutate } from "@/query/auxiliary";
import { RealtimeBroadcastEvent } from "@/realtime/useRealtime";
import { Conversation } from "@/types/tables/messages";

export const handleRealtimeConversation = (
    user_id: string,
    payload: {
        payload: Conversation;
        event: RealtimeBroadcastEvent;
    },
) => {
    if (!payload) {
        return;
    }

    const { payload: conversation } = payload;

    switch (payload.event) {
        case "UPDATE": {
            queryMutate({
                key: ["conversations", user_id],
                value: (state) => {
                    const conversations = new Map(state.conversations);

                    const c = conversations.get(conversation.id);

                    if (!c) {
                        return state;
                    }

                    conversations.set(conversation.id, { ...c, ...conversation });

                    return { ...state, conversations };
                },
            });
            break;
        }
    }
};

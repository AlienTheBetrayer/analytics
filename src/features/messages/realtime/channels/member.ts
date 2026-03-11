import { RealtimeBroadcastEvent } from "@/features/messages/realtime/useRealtime";
import { queryDelete, queryInvalidate, queryMutate } from "@/query/auxiliary";
import { ConversationMember } from "@/types/tables/messages";

export const handleRealtimeMember = (
    user_id: string,
    payload: {
        event: RealtimeBroadcastEvent;
        payload: ConversationMember;
    },
) => {
    const member = payload.payload;

    if (!member || member.user_id !== user_id) {
        return;
    }

    switch (payload.event) {
        case "UPDATE": {
            queryMutate({
                key: ["conversations", user_id],
                value: (state) => {
                    const conversations = new Map(state?.conversations ?? []);

                    const c = conversations.get(member.conversation_id);

                    if (!c) {
                        return state;
                    }

                    conversations.set(member.conversation_id, { ...c, membership: member });

                    return { ...state, conversations };
                },
            });
            break;
        }
        case "DELETE": {
            queryMutate({
                key: ["conversations", user_id],
                value: (state) => {
                    const conversations = new Map(state.conversations);
                    conversations.delete(member.conversation_id);

                    return { ...state, conversations };
                },
            });
            queryDelete({ key: ["messages", member.conversation_id] });
            break;
        }
        case "INSERT": {
            queryInvalidate({ key: ["conversations", user_id] });
            break;
        }
    }
};

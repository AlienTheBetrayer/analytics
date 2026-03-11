import { queryMutate } from "@/query/auxiliary";
import { ConversationMember } from "@/types/tables/messages";

export type RealtimePayloadMember = {
    payload: ConversationMember;
};

export const handleRealtimeMember = (user_id: string, payload: RealtimePayloadMember) => {
    const member = payload.payload;

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
};

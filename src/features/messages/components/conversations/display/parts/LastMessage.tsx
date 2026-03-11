/** @format */

import { LastMessageAuthor } from "@/features/messages/components/conversations/display/parts/LastMessageAuthor";
import { ExpandedConversation } from "@/query-api/protocol/messages";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";

type Props = {
    conversation: ExpandedConversation | null;
};

export const LastMessage = ({ conversation }: Props) => {
    // zustand
    const drafts = useLocalStore((state) => state.drafts);
    const retrievedId = useAppStore((state) => state.retrieved?.conversation_id);

    // ui states
    const draft = conversation?.id && drafts[conversation.id];

    // fallback
    if (!conversation) {
        return null;
    }

    // draft jsx
    if (draft) {
        return (
            <span className="flex items-center gap-1">
                <span className="text-blue-2!">Draft:</span>
                <small className="truncate">{draft}</small>
            </span>
        );
    }

    // jsx
    return (
        <span className="flex items-center gap-1 truncate opacity-75">
            {!!conversation.last_message && (
                <>
                    <LastMessageAuthor conversation={conversation} />
                    <span className="truncate">{conversation.last_message.message}</span>
                </>
            )}

            {!!conversation.membership?.unread_amount && conversation.id !== retrievedId && (
                <div className="flex items-center justify-center rounded-full w-5 h-5 bg-blue-2 ml-auto mr-4 shrink-0">
                    <span className="text-[#f3f3f3]!">{conversation.membership.unread_amount}</span>
                </div>
            )}
        </span>
    );
};

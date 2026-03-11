/** @format */

import { MiniSearch } from "@/features/minisearch/components/MiniSearch";
import { wrapPromise } from "@/promises/core";
import { updateConversationMembers } from "@/query-api/calls/conversation_members";
import { useAppStore } from "@/zustand/store";

export const AddFriends = () => {
    // zustand
    const conversation = useAppStore((state) => state.conversation);

    // fallback
    if (!conversation) {
        return null;
    }

    // jsx
    return (
        <MiniSearch
            required
            text="Add"
            type="friends"
            view="select"
            onSelect={(user_ids) => {
                wrapPromise("addMembers", () => {
                    return updateConversationMembers({
                        type: "add",
                        conversation_id: conversation.id,
                        user_ids,
                    });
                });
            }}
            promiseState="addMembers"
        />
    );
};

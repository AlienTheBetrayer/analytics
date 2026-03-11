/** @format */

import { sortConversations } from "@/features/messages/utils/sort";
import { useAppStore } from "@/zustand/store";
import { useMemo, useEffect } from "react";

export const useList = () => {
    // zustand
    const filter = useAppStore((state) => state.display.conversations.filter);
    const reversed = useAppStore((state) => state.display.conversations.reversed);
    const conversations = useAppStore((state) => state.conversations);
    const updateConversationIds = useAppStore((state) => state.updateConversationIds);

    // ui states
    const trimmedFilter = filter.trim().toLowerCase();

    // splitting
    const ids = useMemo(() => {
        return sortConversations({ conversations, filter, reversed })
    }, [conversations, filter, reversed]);

    // syncing
    useEffect(() => {
        updateConversationIds({ archived: ids.archivedIds, regular: ids.regularIds, notes: ids.notesId });
    }, [ids, updateConversationIds]);

    // returning
    return useMemo(() => {
        return {
            ids,
            trimmedFilter,
        };
    }, [ids, trimmedFilter]);
};

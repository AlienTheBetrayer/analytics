/** @format */

import { ExpandedConversation } from "@/query-api/protocol/messages";
import { useAppStore } from "@/zustand/store";
import { useMemo } from "react";

export const useArchivedDisplay = (archivedIds: string[]) => {
    // zustand
    const conversations = useAppStore((state) => state.conversations?.conversations);

    // memoizing 3 conversations
    return useMemo(() => {
        if (!conversations) {
            return null;
        }

        const archived = archivedIds.slice(0, 3).map((id) => conversations.get(id));

        if (archived.some((v) => !v)) {
            return null;
        }

        return archived as ExpandedConversation[];
    }, [conversations, archivedIds]);
};

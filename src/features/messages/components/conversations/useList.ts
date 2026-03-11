/** @format */

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
        const archivedIds = [] as string[];
        const regularIds = [] as string[];
        let notesId = null as string | null;

        if (!conversations?.ids.length) {
            return { archivedIds, regularIds, notesId };
        }

        for (const id of reversed ? [...conversations.ids].reverse() : conversations.ids) {
            const c = conversations.conversations.get(id);

            if (!c) {
                continue;
            }

            const trimmedFilter = filter.toLowerCase().trim();
            if (trimmedFilter && !c.title?.toLowerCase().trim().includes(trimmedFilter)) {
                continue;
            }

            if (c.type === "notes") {
                notesId = id;
            } else if (c.conversation_meta?.archived) {
                archivedIds.push(id);
            } else {
                regularIds.push(id);
            }
        }

        return { archivedIds, regularIds, notesId };
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

/** @format */

import { CacheAPIProtocol } from "@/query-api/protocol";

/**
 * sorts conversation on a copied object
 * @param options options
 * @returns copied object
 */
export const sortConversations = (options: {
    conversations: CacheAPIProtocol["conversations"]["data"] | null;
    reversed?: boolean;
    filter?: string;
}) => {
    const filteredIds = [] as string[];
    let notesId = null as string | null;

    if (!options.conversations?.ids.length || !options.conversations) {
        return { archivedIds: [], regularIds: [], notesId: null };
    }

    const trimmedFilter = options.filter?.toLowerCase().trim();

    for (const id of options.conversations.ids) {
        const c = options.conversations.conversations.get(id);

        if (!c) {
            continue;
        }

        // filter
        if (trimmedFilter && !c.title?.toLowerCase().trim().includes(trimmedFilter)) {
            continue;
        }

        // notes
        if (c.type === "notes") {
            notesId = id;
            continue;
        }

        filteredIds.push(id);
    }

    // sort ids
    filteredIds.sort((idA, idB) => {
        const a = options.conversations!.conversations.get(idA)!;
        const b = options.conversations!.conversations.get(idB)!;

        const metaA = a.conversation_meta;
        const metaB = b.conversation_meta;

        return (
            Number(!!metaB?.pinned) - Number(!!metaA?.pinned) ||
            (metaA?.pinned && metaB?.pinned ? (metaB?.pinned_at || "").localeCompare(metaA?.pinned_at || "") : 0) ||
            (b.last_message?.created_at || "").localeCompare(a.last_message?.created_at || "")
        );
    });

    // reversal
    if (options.reversed) {
        filteredIds.reverse();
    }

    // splitting
    const archivedIds: string[] = [];
    const regularIds: string[] = [];

    for (const id of filteredIds) {
        const c = options.conversations.conversations.get(id);
        if (c?.conversation_meta?.archived) {
            archivedIds.push(id);
        } else {
            regularIds.push(id);
        }
    }

    return { archivedIds, regularIds, notesId };
};

/**
 * sorts notes on a copied object
 * @param options options
 * @returns copied object
 */
export const sortNotes = <T extends { title: string; pinned?: boolean; pinned_at?: string }>(options: {
    notes: T[];
    filter?: string;
    reversed?: boolean;
}) => {
    let elements = [...options.notes].sort((a, b) => {
        return (
            Number(b.pinned) - Number(a.pinned) ||
            (a.pinned && b.pinned ? (b.pinned_at || "")?.localeCompare(a.pinned_at || "") : 0) ||
            a.title.localeCompare(b.title)
        );
    });

    if (options.filter) {
        elements = elements.filter((e) =>
            e.title
                .toLowerCase()
                .trim()
                .includes(options.filter?.toLowerCase().trim() ?? ""),
        );
    }

    if (options.reversed) {
        elements.reverse();
    }

    return elements;
};

import { filterConversation } from "@/features/messages/utils/filter";
import { CacheAPIProtocol } from "@/query-api/protocol";

/**
 * sorts conversation on a copied object
 * @param options options
 * @returns copied object
 */
export const sortConversations = (options: {
    conversations: CacheAPIProtocol["conversations"]["data"];
    reversed?: boolean;
    filter?: string;
}) => {
    const elements = [...options.conversations]
        .sort((a, b) => {
            const metaA = a.conversation_meta;
            const metaB = b.conversation_meta;

            return (
                Number(!!metaB?.pinned) - Number(!!metaA?.pinned) ||
                (metaA?.pinned && metaB?.pinned
                    ? (metaB?.pinned_at || "").localeCompare(
                          metaA?.pinned_at || "",
                      )
                    : 0) ||
                (b.last_message?.created_at || "").localeCompare(
                    a.last_message?.created_at || "",
                )
            );
        })
        .filter((c) => filterConversation(c, options.filter) && Boolean);

    if (options.reversed) {
        elements.reverse();
    }

    return elements;
};

/**
 * sorts notes on a copied object
 * @param options options
 * @returns copied object
 */
export const sortNotes = <
    T extends { title: string; pinned?: boolean; pinned_at?: string },
>(options: {
    notes: T[];
    filter?: string;
    reversed?: boolean;
}) => {
    let elements = [...options.notes].sort((a, b) => {
        return (
            Number(b.pinned) - Number(a.pinned) ||
            (a.pinned && b.pinned
                ? (b.pinned_at || "")?.localeCompare(a.pinned_at || "")
                : 0) ||
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

/**
 * sorts messages on a copied object
 * @param options options
 * @returns copied object
 */
export const sortMessages = <
    T extends { message: string; created_at: string },
>(options: {
    messages: T[];
    filter?: string;
    reversed?: boolean;
}) => {
    let elements = [...options.messages].sort((a, b) => {
        return b.created_at.localeCompare(a.created_at);
    });

    if (options.filter) {
        elements = elements.filter((e) =>
            e.message
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

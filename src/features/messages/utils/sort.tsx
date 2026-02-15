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

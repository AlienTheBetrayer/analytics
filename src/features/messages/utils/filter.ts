import { CacheAPIProtocol } from "@/query-api/protocol";

/**
 * applies a filter to a given conversation
 * @param data conversation data
 * @param filter_ filter string
 * @returns true if no filter and if filter passed, false if it didn't pass
 */
export const filterConversation = (
    data: CacheAPIProtocol["conversations"]["data"][number],
    filter_?: string,
) => {
    const filter = filter_?.trim().toLowerCase();

    // no filter
    if (!filter) {
        return true;
    }

    // title / description matched
    if (
        data.title?.toLowerCase().trim().includes(filter) ||
        data.description?.toLowerCase().trim().includes(filter)
    ) {
        return true;
    }

    // users matched
    if (
        data.conversation_members.some((m) =>
            m.user.username.toLowerCase().includes(filter),
        )
    ) {
        return true;
    }

    // last message matched
    if (data.last_message?.message.toLowerCase().trim().includes(filter)) {
        return true;
    }

    return false;
};


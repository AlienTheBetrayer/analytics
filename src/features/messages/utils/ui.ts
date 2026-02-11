import { CacheAPIProtocol } from "@/query-api/protocol";

/**
 * determines the title and image url for a given conversation based on its type
 * @param conversation_id id of the conversation
 */
export const conversationData = (options: {
    conversations: CacheAPIProtocol["conversations"]["data"] | null;
    conversation_id: string;
    status: CacheAPIProtocol["status"]["data"] | null;
}): { image_url?: string; title: string } | undefined => {
    if (!options.status || !options.conversations) {
        return;
    }

    const conversation = options.conversations.find(
        (c) => c.id === options.conversation_id,
    );

    switch (conversation?.type) {
        case "dm": {
            const member = conversation.conversation_members.find(
                (m) => m.user_id !== options.status?.id,
            )?.user;

            if (!member) {
                return;
            }

            return {
                title: member.username,
                image_url: member.profile.avatar_url,
            };
        }
        default: {
            return;
        }
    }
};

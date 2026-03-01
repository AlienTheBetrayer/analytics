import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryMutate } from "@/query/auxiliary";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const updateConversationMembers = async (options: {
    conversation_id: string;
    type: "add" | "kick";
    user_ids: string[];
    user: CacheAPIProtocol["status"]["data"];
}) => {
    // optimistic updates
    switch (options.type) {
        case "kick": {
            queryMutate({
                key: ["conversation_members", options.conversation_id],
                value: (state) =>
                    state.filter(
                        (m) => !options.user_ids.some((u) => u === m.user.id),
                    ),
            });
        }
    }

    // query
    const res = await refreshedRequest({
        route: "/api/update/conversation",
        method: "POST",
        body: {
            user_id: options.user.id,
            conversation_id: options.conversation_id,
            type: options.type,
            user_ids: options.user_ids,
        },
    });

    return res;
};

import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryMutate } from "@/query/auxiliary";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const updateConversationMembers = async (
    options: (
        | {
              type: "add" | "kick";
          }
        | {
              type: "permissions";
              can_read?: boolean;
              can_kick?: boolean;
              can_delete_messages?: boolean;
              can_invite?: boolean;
          }
    ) & {
        user: CacheAPIProtocol["status"]["data"];
        user_ids: string[];
        conversation_id: string;
    },
) => {
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
            break;
        }
        case "permissions": {
            const { can_read, can_kick, can_delete_messages, can_invite } =
                options;

            queryMutate({
                key: ["conversation_members", options.conversation_id],
                value: (state) =>
                    state.map((m) =>
                        options.user_ids.includes(m.user_id)
                            ? {
                                  ...m,
                                  can_read,
                                  can_kick,
                                  can_delete_messages,
                                  can_invite,
                              }
                            : m,
                    ),
            });
            break;
        }
    }

    // query
    const res = await refreshedRequest({
        route: "/api/update/conversation_members",
        method: "POST",
        body: {
            user_id: options.user.id,
            conversation_id: options.conversation_id,
            type: options.type,
            user_ids: options.user_ids,
            ...("can_read" in options && { can_read: options.can_read }),
            ...("can_kick" in options && { can_kick: options.can_kick }),
            ...("can_invite" in options && { can_invite: options.can_invite }),
            ...("can_delete_messages" in options && {
                can_delete_messages: options.can_delete_messages,
            }),
        },
    });

    return res;
};

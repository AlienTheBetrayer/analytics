import { MuteOptions } from "@/features/messages/components/message/topline/parts/members/settings/Muting";
import { convertMuteTime } from "@/features/messages/utils/convertMuteTime";
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
              can_send?: boolean;
              is_admin?: boolean;
          }
        | { type: "mute"; time: string; option: (typeof MuteOptions)[number] }
        | { type: "unmute" }
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
            const {
                can_read,
                can_send,
                can_kick,
                can_delete_messages,
                can_invite,
                is_admin,
            } = options;

            queryMutate({
                key: ["conversation_members", options.conversation_id],
                value: (state) =>
                    state.map((m) =>
                        options.user_ids.includes(m.user_id)
                            ? {
                                  ...m,
                                  can_read,
                                  can_send,
                                  can_kick,
                                  can_delete_messages,
                                  can_invite,
                                  is_admin,
                              }
                            : m,
                    ),
            });
            break;
        }
        case "mute":
        case "unmute": {
            queryMutate({
                key: ["conversation_members", options.conversation_id],
                value: (state) =>
                    state.map((m) =>
                        options.user_ids.includes(m.user_id)
                            ? {
                                  ...m,
                                  muted_until:
                                      options.type === "mute"
                                          ? convertMuteTime(
                                                options.time,
                                                options.option,
                                            )
                                          : undefined,
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
            ...("can_send" in options && { can_send: options.can_send }),
            ...("can_kick" in options && { can_kick: options.can_kick }),
            ...("can_invite" in options && { can_invite: options.can_invite }),
            ...("can_delete_messages" in options && {
                can_delete_messages: options.can_delete_messages,
            }),
            ...("is_admin" in options && { is_admin: options.is_admin }),
            ...("time" in options && { time: options.time }),
            ...("option" in options && { option: options.option }),
        },
    });

    return res;
};

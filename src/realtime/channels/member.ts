import { notificationListeners } from "@/notifications/data/init";
import { queryDelete, queryInvalidate, queryMutate } from "@/query/auxiliary";
import { RealtimeBroadcastEvent } from "@/realtime/useRealtime";
import { ConversationMember } from "@/types/tables/messages";
import { relativeTime } from "@/utils/other/relativeTime";

export const handleRealtimeMember = (
    user_id: string,
    payload: {
        event: RealtimeBroadcastEvent;
        payload: ConversationMember;
    },
) => {
    const member = payload.payload;

    if (!member || member.user_id !== user_id) {
        return;
    }

    switch (payload.event) {
        case "UPDATE": {
            queryMutate({
                key: ["conversations", user_id],
                value: (state) => {
                    const conversations = new Map(state?.conversations ?? []);

                    const c = conversations.get(member.conversation_id);

                    if (!c) {
                        return state;
                    }

                    conversations.set(member.conversation_id, { ...c, membership: member });

                    if (!c.membership.muted_until && member.muted_until) {
                        notificationListeners.fire({
                            key: "all",
                            notification: {
                                status: "Error",
                                tab: "Account",
                                title: `You've been muted!`,
                                description: `Your mute will expire ${relativeTime(member.muted_until)}`,
                                type: "Muted",
                            },
                        });
                    } else if (c.membership.muted_until && !member.muted_until) {
                        notificationListeners.fire({
                            key: "all",
                            notification: {
                                status: "Information",
                                tab: "Account",
                                title: `Your mute has expired.`,
                                description: `You are now unmuted!`,
                                type: "Unmuted",
                            },
                        });
                    } else if (c.membership.unread_amount === member.unread_amount) {
                        notificationListeners.fire({
                            key: "all",
                            notification: {
                                status: "Warning",
                                tab: "Account",
                                title: `Permissions changed!`,
                                description: `Your permissions / membership has been changed.`,
                                type: "Membership changed",
                            },
                        });
                    }

                    return { ...state, conversations };
                },
            });
            break;
        }
        case "DELETE": {
            queryMutate({
                key: ["conversations", user_id],
                value: (state) => {
                    const conversations = new Map(state.conversations);
                    conversations.delete(member.conversation_id);

                    return { ...state, conversations };
                },
            });
            queryDelete({ key: ["messages", member.conversation_id] });
            break;
        }
        case "INSERT": {
            queryInvalidate({ key: ["conversations", user_id] });
            break;
        }
    }
};

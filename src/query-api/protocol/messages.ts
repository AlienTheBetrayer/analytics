/** @format */

import { CacheAPIFunctions, CacheAPIProtocol } from "@/query-api/protocol";
import { Profile, User } from "@/types/tables/account";
import { Conversation, Message, ConversationMember, ConversationMeta } from "@/types/tables/messages";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

// reduced types
export type ReducedUser = Pick<User, "id" | "username" | "last_seen_at"> & {
    profile: Pick<Profile, "avatar_url" | "color">;
};

// expanded types
export type ExpandedMessage = Message & {
    cid?: string;
} & {
    reply?: Message;
    forward?: Message;
};

export type ExpandedConversation = Conversation & {
    membership: ConversationMember;
    last_message?: Message & { user: ReducedUser };
    conversation_meta?: Pick<ConversationMeta, "archived" | "pinned" | "pinned_at">;
    peer?: ReducedUser;
};

/**
 * state
 */
export type CacheAPIProtocolMessages = {
    conversation_retrieve: {
        key: ["conversation_retrieve", string, string, string];
        data: {
            conversation_id: string | null | undefined;
            user?: ReducedUser;
        };
    };

    conversations: {
        key: ["conversations", string];
        data: {
            conversations: Map<string, ExpandedConversation>;
            ids: string[];
        };
    };

    conversation_members: {
        key: ["conversation_members", string];
        data: (ConversationMember & {
            user: ReducedUser;
        })[];
    };

    messages: {
        key: ["messages", string];
        data: {
            messages: Map<string, ExpandedMessage>;
            users: Map<string, ReducedUser>;
            ids: string[];
        };
    };
};

/**
 * functions
 */
export const CacheAPIFunctionsMessages: CacheAPIFunctions<CacheAPIProtocolMessages> = {
    messages: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("conversation_id is undefined");
        }

        const data = (
            await refreshedRequest({
                route: "/api/get/messages",
                method: "GET",
                config: {
                    params: { conversation_id: args[0] },
                },
            })
        ).data as { messages: Message[]; users: ReducedUser[] };

        const ids = data.messages.map((m) => m.id);
        const messages = new Map(data.messages.map((m) => [m.id, m]));
        const users = new Map(data.users.map((u) => [u.id, u]));

        return { messages, ids, users };
    },

    conversations: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("user_id is undefined");
        }

        const data = (
            await refreshedRequest({
                route: "/api/get/conversations",
                method: "GET",
                config: { params: { user_id: args[0] } },
            })
        ).data.conversations as ExpandedConversation[];

        const ids = data.map((c) => c.id);
        const conversations = new Map(data.map((c) => [c.id, c]));

        return { conversations, ids };
    },

    conversation_retrieve: async (args: unknown[]) => {
        if (!args[0] || !args[1]) {
            throw new Error("status_id and type are undefined");
        }

        const data = (
            await refreshedRequest({
                route: "/api/get/conversation_retrieve",
                method: "GET",
                config: {
                    params: {
                        type: args[0],
                        status_id: args[1],
                        what: args[2],
                    },
                },
            })
        ).data as CacheAPIProtocol["conversation_retrieve"]["data"];

        return data;
    },

    conversation_members: async (args: unknown[]) => {
        if (!args[0]) {
            throw new Error("conversation_id is undefined");
        }

        return (
            await refreshedRequest({
                route: "/api/get/conversation_members",
                method: "GET",
                config: {
                    params: {
                        conversation_id: args[0],
                    },
                },
            })
        ).data.members;
    },
};

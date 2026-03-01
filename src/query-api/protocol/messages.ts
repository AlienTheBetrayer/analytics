import { CacheAPIFunctions, CacheAPIProtocol } from "@/query-api/protocol";
import { Profile, User } from "@/types/tables/account";
import {
    Conversation,
    Message,
    ConversationMember,
    ConversationMeta,
} from "@/types/tables/messages";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

/**
 * state
 */
export type CacheAPIProtocolMessages = {
    conversation_retrieve: {
        key: ["conversation_retrieve", string, string, string];
        data: {
            conversation_id: string | null | undefined;
            user:
                | CacheAPIProtocol["messages"]["data"][number]["user"]
                | undefined;
        };
    };

    conversations: {
        key: ["conversations", string];
        data: (Conversation & {
            last_message?: Message & {
                user: CacheAPIProtocol["messages"]["data"][number]["user"];
            };

            conversation_meta?: Pick<
                ConversationMeta,
                "archived" | "pinned" | "pinned_at"
            >;

            peer?: Pick<User, "username" | "id" | "last_seen_at"> & {
                profile: Pick<Profile, "avatar_url" | "color">;
            };
        })[];
    };

    conversation_members: {
        key: ["conversation_members", string];
        data: (Pick<ConversationMember, "created_at"> & {
            user: Pick<User, "username" | "id" | "last_seen_at"> & {
                profile: Pick<Profile, "avatar_url" | "color">;
            };
        })[];
    };

    messages: {
        key: ["messages", string];
        data: (Message & {
            cid?: string;
            user: Pick<User, "username" | "id" | "last_seen_at"> & {
                profile: Pick<Profile, "avatar_url" | "color">;
            };
        } & {
            reply?: Omit<
                CacheAPIProtocol["messages"]["data"][number],
                "reply" | "forward"
            >;
            forward?: Omit<
                CacheAPIProtocol["messages"]["data"][number],
                "reply" | "forward"
            >;
        })[];
    };
};

/**
 * functions
 */
export const CacheAPIFunctionsMessages: CacheAPIFunctions<CacheAPIProtocolMessages> =
    {
        messages: async (args: unknown[]) => {
            if (!args[0]) {
                throw new Error("conversation_id is undefined");
            }

            return (
                await refreshedRequest({
                    route: "/api/get/messages",
                    method: "GET",
                    config: {
                        params: { conversation_id: args[0] },
                    },
                })
            ).data.messages;
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
            ).data.conversations as CacheAPIProtocol["conversations"]["data"];

            return data;
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

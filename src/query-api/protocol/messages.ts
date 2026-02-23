import { CacheAPIFunctions, CacheAPIProtocol } from "@/query-api/protocol";
import { Profile, User } from "@/types/tables/account";
import {
    Conversation,
    Message,
    ConversationMember,
    ConversationMeta,
} from "@/types/tables/messages";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";
import axios from "axios";

/**
 * state
 */
export type CacheAPIProtocolMessages = {
    conversation_retrieve: {
        key: ["conversation_retrieve", string, string, string];
        data: {
            conversation_id: string | null | undefined;
            user: (User & { profile: Profile }) | undefined;
        };
    };

    conversations: {
        key: ["conversations", string];
        data: (Conversation & {
            last_message?: Message & { user: User & { profile: Profile } };
            conversation_members: (Pick<
                ConversationMember,
                "user_id" | "created_at"
            > & {
                user: User & { profile: Profile };
            })[];
            conversation_meta?: Pick<
                ConversationMeta,
                "archived" | "pinned" | "pinned_at"
            >;
        })[];
    };

    messages: {
        key: ["messages", string];
        data: (Message & { user: User & { profile: Profile } })[];
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
                await axios.get("/api/get/messages", {
                    params: { conversation_id: args[0] },
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
    };

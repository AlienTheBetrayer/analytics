/** @format */

import { MessagesSelectResult } from "@/features/messages/components/Select";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { MapType } from "@/types/other/utils";
import { DeepPartial } from "@/utils/other/merge";

export type Display = {
    conversations: {
        filter: string;
        reversed: boolean;
        tab: "conversations" | "archive";
    };
    messages: {
        filter: string;
        reversed: boolean;
        selectingMode: boolean;
        selecting: Set<string>;
    };
    notes: {
        filter: string;
        reversed: boolean;
    };
    maximized: boolean;
};

export type MessagesStore = {
    display: Display;
    selectDisplay: MessagesSelectResult;

    messages: CacheAPIProtocol["messages"]["data"] | null;
    conversation: MapType<CacheAPIProtocol["conversations"]["data"]["conversations"]> | null;
    conversations: CacheAPIProtocol["conversations"]["data"] | null;
    conversationsIds: { archived: string[]; regular: string[]; notes: string | null };
    retrieved: CacheAPIProtocol["conversation_retrieve"]["data"] | null;
    noteboard: CacheAPIProtocol["noteboards"]["data"][number] | null;

    updateConversationIds: (conversationIds: MessagesStore["conversationsIds"]) => void;
    updateNoteboard: (noteboard: MessagesStore["noteboard"]) => void;
    updateRetrieved: (retrieved: MessagesStore["retrieved"]) => void;
    updateMessages: (messages: MessagesStore["messages"]) => void;
    updateConversation: (conversation: MessagesStore["conversation"]) => void;
    updateConversations: (conversations: MessagesStore["conversations"]) => void;

    /**
     * updates the select string
     * @param display new select string
     */
    updateSelectDisplay: (display: MessagesSelectResult) => void;

    /**
     * updates the display object
     * @param display deep partial display object
     */
    updateDisplay: (display: DeepPartial<MessagesStore["display"]>) => void;

    updateDisplayFn: (fn: (display: MessagesStore["display"]) => DeepPartial<MessagesStore["display"]>) => void;
};

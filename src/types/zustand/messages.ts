import { MessagesSelectResult } from "@/features/messages/components/Select";
import { DeepPartial } from "@/utils/other/merge";

type MessagesDisplay = {
    tabs: {
        conversations: "conversations" | "archive";
    };
    menus: {
        left: boolean;
        right: boolean;
    };
};

type ConversationsSorting = {
    reversed: boolean;
    filter: string;
};

export type MessagesStore = {
    messagesDisplay: MessagesDisplay;
    selectDisplay: MessagesSelectResult;
    conversationsSorting: ConversationsSorting;

    /**
     * updates the select string
     * @param display new select string
     */
    updateSelectDisplay: (display: MessagesSelectResult) => void;

    /**
     * updates the message display object
     * @param display deep partial display object
     */
    updateMessagesDisplay: (display: DeepPartial<MessagesDisplay>) => void;

    /**
     * updates the convesations sorting parameters
     * @param sorting partial sorting object
     */
    updateConversationsSorting: (
        sorting: Partial<ConversationsSorting>,
    ) => void;
};

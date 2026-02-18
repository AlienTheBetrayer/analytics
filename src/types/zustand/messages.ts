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

export type MessagesStore = {
    messagesDisplay: MessagesDisplay;
    conversationsSorting: {
        filter: string;
        reversed: boolean;
    };
    notesSorting: {
        filter: string;
        reversed: boolean;
    };

    selectDisplay: MessagesSelectResult;
    selectedConversation: string | null;

    /**
     * sets the selected conversation id
     * @param id a new id or null
     */
    updateSelectedConversation: (id: string | null) => void;

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
        sorting: Partial<MessagesStore["conversationsSorting"]>,
    ) => void;

    /**
     * updates the notes sorting parameters
     * @param sorting partial sorting object
     */
    updateNotesSorting: (
        sorting: Partial<MessagesStore["notesSorting"]>,
    ) => void;
};

import { MessagesSelectResult } from "@/features/messages/components/Select";
import { CacheAPIProtocol } from "@/query-api/protocol";
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
        selecting: Map<string, CacheAPIProtocol["messages"]["data"][number]>;
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
     * updates the display object
     * @param display deep partial display object
     */
    updateDisplay: (display: DeepPartial<MessagesStore["display"]>) => void;
};

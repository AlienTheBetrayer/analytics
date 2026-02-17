import { MessagesStore } from "@/types/zustand/messages";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { deepMerge } from "@/utils/other/merge";

export const MessagesSlice: SliceFunction<MessagesStore> = (set) => {
    return {
        messagesDisplay: {
            menus: {
                left: false,
                right: false,
            },
            tabs: {
                conversations: "conversations",
            },
        },
        selectDisplay: "notselected",
        conversationsSorting: {
            filter: "",
            reversed: false,
        },
        notesSorting: {
            filter: "",
            reversed: false,
        },
        selectedConversation: null,

        updateSelectedConversation: (id) => {
            set((state) => ({ ...state, selectedConversation: id }));
        },

        updateSelectDisplay: (display) => {
            set((state) => ({ ...state, selectDisplay: display }));
        },

        updateMessagesDisplay: (display) => {
            set((state) => ({
                ...state,
                messagesDisplay: deepMerge(state.messagesDisplay, display),
            }));
        },

        updateConversationsSorting: (sorting) => {
            set((state) => ({
                ...state,
                conversationsSorting: {
                    ...state.conversationsSorting,
                    ...sorting,
                },
            }));
        },

        updateNotesSorting: (sorting) => {
            set((state) => ({
                ...state,
                notesSorting: {
                    ...state.notesSorting,
                    ...sorting,
                },
            }));
        },
    };
};

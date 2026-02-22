import { MessagesStore } from "@/types/zustand/messages";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { deepMerge } from "@/utils/other/merge";

export const MessagesSlice: SliceFunction<MessagesStore> = (set) => {
    return {
        display: {
            conversations: {
                filter: "",
                reversed: false,
                tab: "conversations",
            },
            messages: {
                filter: "",
                reversed: false,
            },
            notes: {
                filter: "",
                reversed: false,
            },
        },
        selectDisplay: "notselected",
        selectedConversation: null,

        updateSelectedConversation: (id) => {
            set((state) => ({ ...state, selectedConversation: id }));
        },

        updateSelectDisplay: (display) => {
            set((state) => ({ ...state, selectDisplay: display }));
        },

        updateDisplay: (display) => {
            set((state) => ({
                ...state,
                display: deepMerge(state.display, display),
            }));
        },
    };
};

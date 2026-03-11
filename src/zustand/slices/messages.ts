/** @format */

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
                selectingMode: false,
                selecting: new Set(),
            },
            notes: {
                filter: "",
                reversed: false,
            },
            maximized: false,
        },
        selectDisplay: "notselected",

        messages: {
            messages: new Map(),
            ids: [],
            users: new Map(),
        },
        conversation: null,
        retrieved: null,
        noteboard: null,
        conversations: {
            conversations: new Map(),
            ids: [],
        },
        conversationsIds: { archived: [], regular: [], notes: null },

        updateConversationIds: (conversationsIds) => {
            set((state) => ({ ...state, conversationsIds }));
        },

        updateConversations: (conversations) => {
            set((state) => ({ ...state, conversations }));
        },

        updateNoteboard: (noteboard) => {
            set((state) => ({ ...state, noteboard }));
        },

        updateRetrieved: (retrieved) => {
            set((state) => ({ ...state, retrieved }));
        },

        updateConversation: (conversation) => {
            set((state) => ({ ...state, conversation }));
        },

        updateMessages: (messages) => {
            set((state) => ({ ...state, messages }));
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

        updateDisplayFn: (fn) => {
            set((state) => ({
                ...state,
                display: deepMerge(state.display, fn(state.display)),
            }));
        },
    };
};

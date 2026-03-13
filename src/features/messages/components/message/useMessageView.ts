/** @format */

import { queryMutate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import { useAppStore } from "@/zustand/store";
import { useEffect, useMemo } from "react";

export const useMessageView = () => {
    // zustand
    const retrieved = useAppStore((state) => state.retrieved);
    const conversations = useAppStore((state) => state.conversations);
    const selectDisplay = useAppStore((state) => state.selectDisplay);
    const updateDisplay = useAppStore((state) => state.updateDisplay);
    const updateMessages = useAppStore((state) => state.updateMessages);
    const updateConversation = useAppStore((state) => state.updateConversation);

    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const {
        data: messages,
        error,
        isLoading,
    } = useQuery({
        key: ["messages", retrieved?.conversation_id ?? undefined],
        revalidate: true,
    });

    // state
    const conversation =
        (retrieved?.conversation_id && conversations?.conversations.get(retrieved?.conversation_id)) || undefined;

    // syncing global state
    useEffect(() => {
        updateMessages(messages ?? null);
    }, [messages, updateMessages]);
    useEffect(() => {
        updateConversation(conversation ?? null);
    }, [conversation, updateConversation]);

    // moving back out of archived page
    useEffect(() => {
        updateDisplay({
            conversations: {
                tab: conversation?.conversation_meta?.archived ? "archive" : "conversations",
            },
        });
    }, [conversation?.conversation_meta?.archived, updateDisplay]);

    // resetting unread + selection
    useEffect(() => {
        if (!conversation?.id || !status) {
            return;
        }

        queryMutate({
            key: ["conversations", status.id],
            value: (state) => {
                const c = state.conversations.get(conversation.id);

                if (!c) {
                    return state;
                }

                const conversations = new Map(state.conversations).set(conversation.id, {
                    ...c,
                    membership: {
                        ...(c.membership ?? {}),
                        unread_amount: undefined,
                    },
                });

                return { ...state, conversations };
            },
        });

        updateDisplay({ messages: { selectingMode: false, selecting: new Set() } });
    }, [conversation?.id, status, updateDisplay]);

    // determining fallback's code
    const fallbackCode = useMemo(() => {
        if (error && "error" in error && error.error && typeof error.error === "string") {
            return error.error;
        }

        if (isLoading) {
            return "loading";
        }

        if (retrieved?.conversation_id && !retrieved?.user && !messages) {
            return "wrong-url";
        }

        switch (selectDisplay) {
            case "notselected": {
                return "not-selected";
            }
            case "wrong": {
                return "wrong-url";
            }
        }
    }, [selectDisplay, retrieved, isLoading, error, messages]);

    // returning
    return useMemo(() => {
        return {
            fallbackCode,
            messages,
            error,
            isLoading,
        };
    }, [fallbackCode, messages, error, isLoading]);
};

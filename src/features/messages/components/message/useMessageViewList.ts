/** @format */

import { MessageDisplayProps } from "@/features/messages/components/message/display/MessageDisplay";
import { MessageInputProps } from "@/features/messages/components/message/input/MessageInput";
import { upsertMessage } from "@/query-api/calls/messages";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { MapType } from "@/types/other/utils";
import { useAppStore } from "@/zustand/store";
import { redirect } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export const useMessageViewList = () => {
    // zustand
    const messages = useAppStore((state) => state.messages);
    const filter = useAppStore((state) => state.display.messages).filter;

    // editing
    const [actionType, setActionType] = useState<MessageInputProps["type"]>("send");
    const [actionMessage, setActionMessage] = useState<MapType<CacheAPIProtocol["messages"]["data"]["messages"]>>();

    // messages
    const messageIds = useMemo(() => {
        const trimmedFilter = filter.trim();

        if (!messages) {
            return [];
        }

        if (!trimmedFilter) {
            return messages?.ids;
        }

        return messages.ids.filter((id) =>
            messages.messages.get(id)?.message.trim().toLowerCase().includes(trimmedFilter),
        );
    }, [messages, filter]);

    // ui states
    const conversationId = messages?.ids.at(0) && messages.messages.get(messages.ids[0])?.conversation_id;

    // API
    const onMessageAction: MessageDisplayProps["onAction"] = useCallback((message, type, conversation) => {
        switch (type) {
            case "forward": {
                if (!conversation) {
                    break;
                }

                upsertMessage({
                    type: "send",
                    message_type: "forward",
                    conversation_id: conversation.id,
                    message: message.message,
                    forward: message,
                }).then(() => {
                    redirect(`/messages/c/${conversation?.id}`);
                });
                break;
            }
            default: {
                setActionType(type);
                setActionMessage(message);
                break;
            }
        }
    }, []);

    // returning
    return useMemo(() => {
        return {
            actionType,
            actionMessage,
            messageIds,
            conversationId,
            setActionType,
            setActionMessage,
            onMessageAction,
        };
    }, [actionType, actionMessage, messageIds, conversationId, onMessageAction]);
};

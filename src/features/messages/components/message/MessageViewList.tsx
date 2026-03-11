/** @format */

import { FilterNothing } from "@/features/messages/components/errors/FilterNothing";
import { NoMessages } from "@/features/messages/components/errors/NoMessages";
import { MessageDisplay, MessageDisplayProps } from "@/features/messages/components/message/display/MessageDisplay";
import { MessageInput } from "@/features/messages/components/message/input/MessageInput";
import { MessagesTopline } from "@/features/messages/components/message/topline/MessagesTopline";
import { useMessageViewList } from "@/features/messages/components/message/useMessageViewList";
import { useAppStore } from "@/zustand/store";
import { useCallback, useEffect } from "react";
import { List, RowComponentProps, useDynamicRowHeight, useListRef } from "react-window";

export const MessageViewList = () => {
    // zustand
    const filter = useAppStore((state) => state.display.messages.filter);
    const reversed = useAppStore((state) => state.display.messages.reversed);
    const selectionMode = useAppStore((state) => state.display.messages.selectingMode);

    // ui states
    const trimmedFilter = filter.trim();

    // messages(with filtering) + editing/actions
    const { messageIds, actionMessage, actionType, setActionMessage, setActionType, onMessageAction } =
        useMessageViewList();

    // refs
    const listRef = useListRef(null);

    // scrolling
    const scrollToBottom = useCallback(
        (behavior: "smooth" | "instant") => {
            if (!listRef.current?.element) {
                return;
            }

            const { scrollHeight } = listRef.current.element;
            listRef.current.element.scrollTo({ top: scrollHeight, behavior });
        },
        [listRef],
    );

    // bottom scrolling
    useEffect(() => {
        requestAnimationFrame(() => {
            scrollToBottom("smooth");
        });
    }, [messageIds.length, scrollToBottom]);

    // virtualized list
    const rowHeight = useDynamicRowHeight({
        defaultRowHeight: 40,
    });

    // jsx
    return (
        <article className="flex flex-col bg-bg-2! grow p-4! gap-2 rounded-4xl">
            <MessagesTopline />

            {messageIds.length ?
                <div className="flex flex-col grow relative h-100">
                    <List
                        overscanCount={0}
                        listRef={listRef}
                        rowComponent={MessageDisplayRow}
                        rowCount={messageIds.length}
                        style={{ colorScheme: "dark", scrollbarWidth: "thin", overflowY: "scroll", height: "100%" }}
                        rowHeight={rowHeight}
                        rowProps={{
                            messageIds: reversed ? [...messageIds].reverse() : messageIds,
                            selectionMode,
                            onAction: onMessageAction,
                        }}
                    />
                </div>
            :   <div className="flex items-center justify-center grow">
                    {trimmedFilter ?
                        <FilterNothing type="messages" />
                    :   <NoMessages />}
                </div>
            }

            <MessageInput
                onCancel={() => {
                    setActionMessage(undefined);
                    setActionType("send");
                }}
                onAction={() => {
                    requestAnimationFrame(() => {
                        scrollToBottom("smooth");
                    });
                }}
                type={actionType}
                actionMessage={actionMessage}
            />
        </article>
    );
};

const MessageDisplayRow = ({
    messageIds,
    style,
    onAction,
    selectionMode,
    index,
}: RowComponentProps<
    {
        messageIds: string[];
    } & Pick<MessageDisplayProps, "onAction" | "selectionMode">
>) => {
    const id = messageIds[index];
    const isSelected = useAppStore((state) => state.display.messages.selecting.has(id));

    if (!id) {
        return null;
    }

    return (
        <div style={style}>
            <MessageDisplay
                id={id}
                onAction={onAction}
                isSelected={isSelected}
                selectionMode={selectionMode}
            />
        </div>
    );
};

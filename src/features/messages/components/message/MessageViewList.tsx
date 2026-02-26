import { FilterNothing } from "@/features/messages/components/errors/FilterNothing";
import { NoMessages } from "@/features/messages/components/errors/NoMessages";
import { MessageDisplay } from "@/features/messages/components/message/display/MessageDisplay";
import {
    MessageInputProps,
    MessageInput,
} from "@/features/messages/components/message/input/MessageInput";
import { MessagesTopline } from "@/features/messages/components/message/topline/MessagesTopline";
import { sortMessages } from "@/features/messages/utils/sort";
import { upsertMessage } from "@/query-api/calls/messages";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { useAppStore } from "@/zustand/store";
import { redirect } from "next/navigation";
import { useMemo, useRef, useState } from "react";

type Props = {
    data: CacheAPIProtocol["messages"]["data"] | null;
    conversationData?: CacheAPIProtocol["conversations"]["data"][number];
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};
export const MessageViewList = ({
    data,
    conversationData,
    retrieved,
}: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const display = useAppStore((state) => state.display.messages);
    const listRef = useRef<HTMLUListElement | null>(null);

    // sorting
    const sorted = useMemo(() => {
        if (!data?.length) {
            return [];
        }

        return sortMessages({
            messages: data,
            filter: display.filter,
            reversed: display.reversed,
        });
    }, [data, display]);

    // editing + auto-focusing
    const [actionType, setActionType] =
        useState<MessageInputProps["type"]>("send");
    const [actionMessage, setActionMessage] = useState<
        CacheAPIProtocol["messages"]["data"][number] | undefined
    >(undefined);

    return (
        <article className="flex flex-col bg-bg-2! grow p-4! gap-2 rounded-4xl">
            <MessagesTopline
                conversationData={conversationData}
                data={data}
                retrieved={retrieved}
            />

            {!data?.length ? (
                <div className="flex items-center justify-center grow">
                    <NoMessages />
                </div>
            ) : !sorted.length ? (
                <div className="flex items-center justify-center grow">
                    <FilterNothing type="messages" />
                </div>
            ) : (
                <ul
                    className="flex flex-col-reverse grow relative h-100 scheme-dark overflow-y-auto pt-24!"
                    style={{
                        scrollbarWidth: "thin",
                    }}
                    ref={listRef}
                >
                    {sorted.map((message) => (
                        <li key={message.cid || message.id}>
                            <MessageDisplay
                                conversationData={conversationData}
                                data={message}
                                onAction={(type, response) => {
                                    switch (type) {
                                        case "forward": {
                                            if (
                                                !response?.conversation ||
                                                !status
                                            ) {
                                                break;
                                            }

                                            upsertMessage({
                                                type: "send",
                                                message_type: "forward",
                                                conversation_id:
                                                    response.conversation.id,
                                                message: message.message,
                                                forward: message,
                                                user: status,
                                            }).then(() => {
                                                redirect(
                                                    `/messages/c/${response.conversation?.id}`,
                                                );
                                            });
                                            break;
                                        }
                                        default: {
                                            setActionType(type);
                                            setActionMessage(message);
                                            break;
                                        }
                                    }
                                }}
                            />
                        </li>
                    ))}
                </ul>
            )}

            <MessageInput
                onCancel={() => {
                    setActionMessage(undefined);
                    setActionType("send");
                }}
                onAction={() => {
                    setTimeout(() => {
                        listRef.current?.scrollTo({
                            top: listRef.current.scrollHeight,
                            behavior: "smooth",
                        });
                    }, 50);
                }}
                data={data}
                retrieved={retrieved}
                type={actionType}
                actionMessage={actionMessage}
            />
        </article>
    );
};

import { NoMessages } from "@/features/messages/components/errors/NoMessages";
import { MessageDisplay } from "@/features/messages/components/message/display/MessageDisplay";
import { MessageInput } from "@/features/messages/components/message/MessageInput";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { MessagesTopline } from "@/features/messages/components/message/topline/MessagesTopline";
import { useAppStore } from "@/zustand/store";
import { NoteBoard } from "@/features/messages/components/noteboard/NoteBoard";
import { WrongURL } from "@/features/messages/components/errors/WrongURL";
import { NotSelected } from "@/features/messages/components/errors/NotSelected";
import { sortMessages } from "@/features/messages/utils/sort";
import { FilterNothing } from "@/features/messages/components/errors/FilterNothing";
import { useEffect, useMemo, useState } from "react";
import { LoadingMessages } from "@/features/messages/components/errors/LoadingMessages";

type Props = {
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};
export const MessageView = ({ retrieved }: Props) => {
    const selectDisplay = useAppStore((state) => state.selectDisplay);
    const updateDisplay = useAppStore((state) => state.updateDisplay);
    const display = useAppStore((state) => state.display.messages);

    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data, isLoading } = useQuery({
        key: ["messages", retrieved?.conversation_id ?? undefined],
        revalidate: true,
    });
    const { data: conversations } = useQuery({
        key: ["conversations", status?.id],
    });
    const conversation = useMemo(() => {
        return conversations?.find((c) => c.id === retrieved?.conversation_id);
    }, [conversations, retrieved?.conversation_id]);

    // moving back out of archived page
    useEffect(() => {
        updateDisplay({
            conversations: {
                tab: conversation?.conversation_meta?.archived
                    ? "archive"
                    : "conversations",
            },
        });
    }, [conversation?.conversation_meta?.archived, updateDisplay]);

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
    const [editing, setEditing] = useState<boolean>(false);
    const [replying, setReplying] = useState<boolean>(false);
    const [actionMessage, setActionMessage] = useState<
        CacheAPIProtocol["messages"]["data"][number] | undefined
    >(undefined);

    // fallbacks
    const code = (() => {
        if (isLoading) {
            return "loading";
        }

        if (retrieved?.conversation_id && !retrieved?.user && !data) {
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
    })();

    if (code) {
        return (
            <article className="flex flex-col bg-bg-2! grow p-4! gap-2 rounded-4xl">
                <MessagesTopline
                    conversationData={conversation}
                    data={data}
                    retrieved={retrieved}
                />
                <div className="flex items-center justify-center loading grow">
                    {(() => {
                        switch (code) {
                            case "loading": {
                                return <LoadingMessages />;
                            }
                            case "wrong-url": {
                                return <WrongURL />;
                            }
                            case "not-selected": {
                                return <NotSelected />;
                            }
                        }
                    })()}
                </div>
            </article>
        );
    }

    // noteboard jsx
    if (selectDisplay === "noteboard") {
        return (
            <article className="flex flex-col bg-bg-2! grow p-4! gap-2 rounded-4xl">
                <MessagesTopline
                    conversationData={conversation}
                    data={data}
                    retrieved={retrieved}
                />
                <NoteBoard />
            </article>
        );
    }

    // main jsx
    return (
        <article className="flex flex-col bg-bg-2! grow p-4! gap-2 rounded-4xl">
            <MessagesTopline
                conversationData={conversation}
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
                    className="flex flex-col-reverse gap-0.5 grow relative h-100 scheme-dark overflow-y-auto"
                    style={{
                        scrollbarWidth: "thin",
                    }}
                >
                    {sorted.map((message) => (
                        <li key={message.id}>
                            <MessageDisplay
                                conversationData={conversation}
                                data={message}
                                onEdit={() => {
                                    setActionMessage(message);
                                    setEditing((prev) => !prev);
                                }}
                                onReply={() => {
                                    setActionMessage(message);
                                    setReplying((prev) => !prev);
                                }}
                            />
                        </li>
                    ))}
                </ul>
            )}

            <MessageInput
                onCancel={() => {
                    setActionMessage(undefined);
                    setEditing(false);
                    setReplying(false);
                }}
                data={data}
                retrieved={retrieved}
                type={replying ? "reply" : editing ? "edit" : "send"}
                actionMessage={actionMessage}
            />
        </article>
    );
};

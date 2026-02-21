import { NoMessages } from "@/features/messages/components/errors/NoMessages";
import { MessageDisplay } from "@/features/messages/components/message/MessageDisplay";
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
import { useMemo, useState } from "react";

type Props = {
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};
export const MessageView = ({ retrieved }: Props) => {
    const selectDisplay = useAppStore((state) => state.selectDisplay);
    const display = useAppStore((state) => state.display.messages);

    // fetching + sorting
    const { data, isLoading } = useQuery({
        key: ["messages", retrieved?.conversation_id ?? undefined],
    });
    console.log(retrieved?.conversation_id);
    const sorted = useMemo(() => {
        if (!data) {
            return [];
        }

        return sortMessages({
            messages: data.messages,
            filter: display.filter,
            reversed: display.reversed,
        });
    }, [data, display]);

    // editing + auto-focusing
    const [editing, setEditing] = useState<boolean>(false);
    const [editingMessage, setEditingMessage] = useState<
        CacheAPIProtocol["messages"]["data"]["messages"][number] | undefined
    >(undefined);

    // fallbacks
    if (isLoading) {
        return (
            <div className="flex flex-col justify-between gap-2 grow">
                {Array.from({ length: 8 }, (_, k) => (
                    <div
                        key={k}
                        className="w-full h-14 loading"
                    />
                ))}
            </div>
        );
    }

    switch (selectDisplay) {
        case "notselected": {
            return (
                <div className="flex items-center justify-center relative grow loading">
                    <NotSelected />
                </div>
            );
        }
        case "wrong": {
            return (
                <div className="flex items-center justify-center relative grow loading">
                    <WrongURL />
                </div>
            );
        }
        case "noteboard": {
            return (
                <article className="flex flex-col bg-bg-2! grow p-4! gap-2 rounded-4xl">
                    <MessagesTopline
                        data={data}
                        retrieved={retrieved}
                    />
                    <NoteBoard />
                </article>
            );
        }
    }

    return (
        <article className="flex flex-col bg-bg-2! grow p-4! gap-2 rounded-4xl">
            <MessagesTopline
                data={data}
                retrieved={retrieved}
            />

            {!data?.messages.length ? (
                <div className="flex items-center justify-center grow">
                    <NoMessages />
                </div>
            ) : !sorted.length ? (
                <div className="flex items-center justify-center grow">
                    <FilterNothing type="messages" />
                </div>
            ) : (
                <ul className="flex flex-col-reverse gap-0.5 grow relative">
                    {sorted.map((message) => (
                        <li key={message.id}>
                            <MessageDisplay
                                data={message}
                                onEdit={() => {
                                    setEditingMessage(message);
                                    setEditing((prev) => !prev);
                                }}
                            />
                        </li>
                    ))}
                </ul>
            )}

            <MessageInput
                onCancel={() => {
                    setEditing(false);
                }}
                data={data}
                retrieved={retrieved}
                type={editing ? "edit" : "send"}
                editingMessage={editingMessage}
            />
        </article>
    );
};

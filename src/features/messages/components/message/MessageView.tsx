import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { MessagesTopline } from "@/features/messages/components/message/topline/MessagesTopline";
import { useAppStore } from "@/zustand/store";
import { NoteBoard } from "@/features/messages/components/noteboard/NoteBoard";
import { WrongURL } from "@/features/messages/components/errors/WrongURL";
import { NotSelected } from "@/features/messages/components/errors/NotSelected";
import { useEffect, useMemo } from "react";
import { MessageViewList } from "@/features/messages/components/message/MessageViewList";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { NoPermissions } from "@/features/messages/components/errors/NoPermissions";
import { CantRead } from "@/features/messages/components/errors/CantRead";
import { Muted } from "@/features/messages/components/errors/Muted";
import { queryMutate } from "@/query/auxiliary";

type Props = {
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};
export const MessageView = ({ retrieved }: Props) => {
    const selectDisplay = useAppStore((state) => state.selectDisplay);
    const updateDisplay = useAppStore((state) => state.updateDisplay);

    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data, error, isLoading } = useQuery({
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

    // resetting unread
    useEffect(() => {
        if (!conversation?.id || !status) {
            return;
        }

        queryMutate({
            key: ["conversations", status.id],
            value: (state) =>
                state.map((c) =>
                    c.id === conversation.id
                        ? {
                              ...c,
                              membership: {
                                  ...c.membership,
                                  unread_amount: undefined,
                              },
                          }
                        : c,
                ),
        });
    }, [conversation?.id, status]);

    // fallbacks
    const code = (() => {
        if (error && "error" in error && error.error) {
            return error.error;
        }

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
                                return <Spinner />;
                            }
                            case "wrong-url": {
                                return <WrongURL />;
                            }
                            case "not-selected": {
                                return <NotSelected />;
                            }
                            case "cant-read": {
                                return <CantRead />;
                            }
                            case "muted": {
                                return (
                                    <Muted
                                        muted_until={
                                            conversation?.membership.muted_until
                                        }
                                    />
                                );
                            }
                            case "not-allowed": {
                                return <NoPermissions />;
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

    // MAIN jsx
    return (
        <MessageViewList
            conversationData={conversation}
            data={data}
            retrieved={retrieved}
        />
    );
};

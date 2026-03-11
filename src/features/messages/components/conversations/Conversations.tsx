/** @format */

import { ConversationsTopline } from "@/features/messages/components/conversations/topline/ConversationsTopline";
import { List } from "@/features/messages/components/conversations/List";
import { useQuery } from "@/query/core";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { useEffect } from "react";
import { useAppStore } from "@/zustand/store";

export const Conversations = () => {
    // zustand
    const zustandConversations = useAppStore((state) => state.conversations);
    const updateConversations = useAppStore((state) => state.updateConversations);

    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data: conversations, isLoading } = useQuery({
        key: ["conversations", status?.id],
        revalidate: true,
    });

    // syncing
    useEffect(() => {
        updateConversations(conversations ?? null);
    }, [conversations, updateConversations]);

    // jsx
    return (
        <article className="w-full flex flex-col bg-bg-2! grow p-4! gap-2 rounded-4xl relative">
            <ConversationsTopline />

            {isLoading || !zustandConversations ?
                <div className="flex items-center justify-center grow loading">
                    <Spinner />
                </div>
            :   <List />}
        </article>
    );
};

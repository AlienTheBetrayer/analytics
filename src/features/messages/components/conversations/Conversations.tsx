import { ConversationsTopline } from "@/features/messages/components/conversations/topline/ConversationsTopline";
import { List } from "@/features/messages/components/conversations/List";
import { useQuery } from "@/query/core";

export const Conversations = () => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data: conversations, isLoading } = useQuery({
        key: ["conversations", status?.id],
        revalidate: true,
    });

    return (
        <div className="w-full flex flex-col bg-bg-2! grow p-4! gap-2 rounded-4xl relative">
            <ConversationsTopline data={conversations} />
            <List
                isLoading={isLoading}
                conversations={conversations}
            />
        </div>
    );
};

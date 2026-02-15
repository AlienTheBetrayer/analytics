import { ConversationsTopline } from "@/features/messages/components/conversations/topline/ConversationsTopline";
import { List } from "@/features/messages/components/conversations/List";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";

type Props = {
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};

export const Conversations = ({ retrieved }: Props) => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data: conversations, isLoading } = useQuery({
        key: ["conversations", status?.id],
    });

    return (
        <div className="flex flex-col bg-bg-2! grow p-4! gap-4 rounded-4xl">
            <ConversationsTopline data={conversations} />
            <List
                isLoading={isLoading}
                conversations={conversations}
                conversation_id={retrieved?.conversation_id}
            />
        </div>
    );
};

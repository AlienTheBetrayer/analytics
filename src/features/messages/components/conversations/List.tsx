import { ConversationDisplay } from "@/features/messages/components/conversations/ConversationDisplay";
import { FilterNothing } from "@/features/messages/components/errors/FilterNothing";
import { NoConversations } from "@/features/messages/components/errors/NoConversations";
import { filterConversation } from "@/features/messages/utils/filter";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";

type Props = {
    isLoading?: boolean;
    conversation_id?: string | null;
    conversations: CacheAPIProtocol["conversations"]["data"] | null;
    filter?: string;
    reversed?: boolean;
    onClear?: () => void;
};
export const List = ({
    isLoading,
    conversations,
    filter,
    conversation_id,
    reversed,
    onClear,
}: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    if (isLoading || !conversations) {
        return (
            <div className="flex flex-col gap-2 relative">
                {Array.from({ length: 8 }, (_, k) => (
                    <div
                        key={k}
                        className="w-full h-12 loading"
                    />
                ))}
            </div>
        );
    }

    // fallbacks
    if (conversations && !conversations.length) {
        return (
            <div className="flex flex-col gap-2 relative">
                {Array.from({ length: 8 }, (_, k) => (
                    <div
                        key={k}
                        className="w-full h-12 loading"
                    />
                ))}

                <NoConversations username={status?.username} />
            </div>
        );
    }

    const elements = (reversed ? [...conversations].reverse() : conversations)
        .map(
            (c) =>
                filterConversation(c, filter) && (
                    <li key={c.id}>
                        <ConversationDisplay
                            data={c}
                            isSelected={c.id === conversation_id}
                        />
                    </li>
                ),
        )
        .filter(Boolean);

    // jsx
    return (
        <ul className="flex flex-col gap-1 relative grow">
            {elements.length ? (
                <>
                    <li></li>

                    {elements}
                </>
            ) : (
                <FilterNothing onClear={() => onClear?.()} />
            )}
        </ul>
    );
};

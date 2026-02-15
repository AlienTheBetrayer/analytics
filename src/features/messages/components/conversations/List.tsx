import { ArchivedDisplay } from "@/features/messages/components/conversations/archived/ArchivedDisplay";
import { ConversationDisplay } from "@/features/messages/components/conversations/display/ConversationDisplay";
import { FilterNothing } from "@/features/messages/components/errors/FilterNothing";
import { NoConversations } from "@/features/messages/components/errors/NoConversations";
import { sortConversations } from "@/features/messages/utils/sort";
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

    const conversationTypes = conversations.reduce(
        (acc, val) => {
            if (val.conversation_meta?.archived) {
                acc.archived.push(val);
            } else {
                acc.regular.push(val);
            }

            return acc;
        },
        {
            archived: Array<(typeof conversations)[number]>(),
            regular: Array<(typeof conversations)[number]>(),
        },
    );

    const archived = sortConversations({
        conversations: conversationTypes.archived,
        reversed,
        filter,
    });
    const regular = sortConversations({
        conversations: conversationTypes.regular,
        reversed,
        filter,
    });

    // jsx
    return (
        <ul className="flex flex-col gap-1 relative grow">
            {regular.length ? (
                <>
                    {archived.length && (
                        <li>
                            <ArchivedDisplay />
                        </li>
                    )}

                    {regular.map((c) => (
                        <li key={c.id}>
                            <ConversationDisplay
                                data={c}
                                isSelected={c.id === conversation_id}
                            />
                        </li>
                    ))}
                </>
            ) : (
                <FilterNothing onClear={() => onClear?.()} />
            )}
        </ul>
    );
};

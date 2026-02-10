import { NoConversations } from "@/features/messages/components/errors/NoConversations";
import { Input } from "@/features/ui/input/components/Input";
import { useQuery } from "@/query/core";
import { Conversation } from "@/types/tables/messages";
import { useState } from "react";

export const Conversations = () => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data: conversations, isLoading } = useQuery({
        key: ["conversations", status?.username],
    });

    // react states
    const [search, setSearch] = useState<string>("");

    return (
        <div className="flex flex-col bg-bg-2! grow p-4! gap-4 rounded-4xl">
            <div className="box h-10! p-0! items-center! flex-row!">
                <Input
                    isEnabled={!!conversations?.length}
                    placeholder="Search..."
                    value={search}
                    onChange={(value) => setSearch(value)}
                />
            </div>

            <List
                isLoading={isLoading}
                conversations={conversations}
            />
        </div>
    );
};

type ListProps = {
    isLoading: boolean;
    conversations: Conversation[] | null;
};
const List = ({ isLoading, conversations }: ListProps) => {
    const { data: status } = useQuery({ key: ["status"] });

    if (isLoading) {
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
    if (!conversations?.length) {
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

    // jsx
    return (
        <ul>
            {conversations.map((c) => (
                <li key={c.id}>
                    <span>{c.id}</span>
                </li>
            ))}
        </ul>
    );
};

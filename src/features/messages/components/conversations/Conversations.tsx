import { ConversationDisplay } from "@/features/messages/components/conversations/ConversationDisplay";
import { NoConversations } from "@/features/messages/components/errors/NoConversations";
import { filterConversation } from "@/features/messages/utils/filter";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useState } from "react";

export const Conversations = () => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data: conversations, isLoading } = useQuery({
        key: ["conversations", status?.id],
    });

    // react states
    const [filter, setFilter] = useState<string>("");
    const [reversed, setReversed] = useState<boolean>(false);

    return (
        <div className="flex flex-col bg-bg-2! grow p-4! gap-4 rounded-4xl">
            <ul className="box h-10! gap-1! p-0! items-center! flex-row!">
                <li>
                    <Button onClick={() => setReversed((prev) => !prev)}>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/sort.svg"
                            className={`${reversed ? "rotate-180" : ""} duration-500!`}
                        />
                        <TabSelection
                            condition={true}
                            color={
                                reversed ? "var(--orange-1)" : "var(--blue-1)"
                            }
                        />
                    </Button>
                </li>

                <li>
                    <Input
                        isEnabled={!!conversations?.length}
                        placeholder="Search..."
                        value={filter}
                        onChange={(value) => setFilter(value)}
                    />
                </li>

                <li className="ml-auto!">
                    <Button
                        onClick={() => {
                            wrapPromise("reloadConversations", async () => {
                                return queryInvalidate({
                                    key: ["conversations", status?.id],
                                    silent: false,
                                });
                            });
                        }}
                    >
                        <PromiseState state="reloadConversations" />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/reload.svg"
                        />
                    </Button>
                </li>
            </ul>

            <List
                isLoading={isLoading}
                conversations={conversations}
                filter={filter}
                reversed={reversed}
            />
        </div>
    );
};

type ListProps = {
    isLoading: boolean;
    conversations: CacheAPIProtocol["conversations"]["data"] | null;
    filter?: string;
    reversed?: boolean;
};
const List = ({ isLoading, conversations, filter, reversed }: ListProps) => {
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
        <ul className="flex flex-col gap-1">
            {(reversed ? [...conversations].reverse() : conversations).map(
                (c) =>
                    filterConversation(c, filter) && (
                        <li key={c.id}>
                            <ConversationDisplay data={c} />
                        </li>
                    ),
            )}
        </ul>
    );
};

import { List } from "@/features/messages/components/conversations/List";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
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
                        placeholder="Filter..."
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
                onClear={() => setFilter("")}
            />
        </div>
    );
};

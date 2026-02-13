import { CreateConversation } from "@/features/messages/components/conversations/CreateConversation";
import { List } from "@/features/messages/components/conversations/List";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useState } from "react";

type Props = {
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};

export const Conversations = ({ retrieved }: Props) => {
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
                    <Tooltip
                        direction="top"
                        text="Sorting direction"
                    >
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
                                    reversed
                                        ? "var(--orange-1)"
                                        : "var(--blue-1)"
                                }
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li className="w-full">
                    <Input
                        isEnabled={!!conversations?.length}
                        placeholder="Filter..."
                        value={filter}
                        onChange={(value) => setFilter(value)}
                    />
                </li>

                <li className="ml-auto!">
                    <Tooltip
                        direction="top"
                        text="Create a conversation"
                    >
                        <Modal
                            element={() => <CreateConversation />}
                            direction="bottom"
                        >
                            <Button>
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/cubeadd.svg"
                                />
                            </Button>
                        </Modal>
                    </Tooltip>
                </li>

                <li className="shrink-0">
                    <Tooltip
                        direction="top"
                        text="Re-fetch list"
                    >
                        <Button
                            onClick={() => {
                                if (!status) {
                                    return;
                                }

                                wrapPromise("reloadConversations", async () => {
                                    return queryInvalidate({
                                        key: ["conversations", status.id],
                                        silent: false,
                                    });
                                });
                            }}
                        >
                            <PromiseState state="reloadConversations" />
                            <Image
                                alt=""
                                width={14}
                                height={14}
                                src="/reload.svg"
                            />
                        </Button>
                    </Tooltip>
                </li>
            </ul>

            <List
                isLoading={isLoading}
                conversations={conversations}
                conversation_id={retrieved?.conversation_id}
                filter={filter}
                reversed={reversed}
                onClear={() => setFilter("")}
            />
        </div>
    );
};

import { CreateConversation } from "@/features/messages/components/conversations/CreateConversation";
import { Title } from "@/features/messages/components/conversations/topline/Title";
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
import { useAppStore } from "@/zustand/store";
import { motion } from "motion/react";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"] | null;
};

export const ConversationsTopline = ({ data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const conversationsSorting = useAppStore(
        (state) => state.conversationsSorting,
    );
    const updateConversationsSorting = useAppStore(
        (state) => state.updateConversationsSorting,
    );
    const messagesDisplay = useAppStore((state) => state.messagesDisplay);
    const updateMessagesDisplay = useAppStore(
        (state) => state.updateMessagesDisplay,
    );

    return (
        <div className="flex flex-col gap-2">
            <ul className="box h-10! gap-1! p-0! items-center! flex-row!">
                <li className="flex items-center justify-center w-full">
                    <Title data={data} />
                </li>
            </ul>

            <ul className="box h-10! gap-0.5! p-0! items-center! flex-row!">
                <motion.li
                    animate={{
                        width:
                            messagesDisplay.tabs.conversations !==
                            "conversations"
                                ? "auto"
                                : 0,
                    }}
                    className="overflow-hidden p-0! shrink-0"
                >
                    <Tooltip
                        direction="top"
                        text="Back to conversations"
                    >
                        <Button
                            onClick={() =>
                                updateMessagesDisplay({
                                    tabs: {
                                        conversations: "conversations",
                                    },
                                })
                            }
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/back.svg"
                            />
                            <TabSelection
                                condition={true}
                                color="var(--orange-1)"
                            />
                        </Button>
                    </Tooltip>
                </motion.li>

                <li>
                    <Tooltip
                        direction="top"
                        text="Sorting direction"
                    >
                        <Button
                            onClick={() =>
                                updateConversationsSorting({
                                    reversed: !conversationsSorting.reversed,
                                })
                            }
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/sort.svg"
                                className={`${conversationsSorting.reversed ? "rotate-180" : ""} duration-500!`}
                            />
                            <TabSelection
                                condition={true}
                                color={
                                    conversationsSorting.reversed
                                        ? "var(--orange-1)"
                                        : "var(--blue-1)"
                                }
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li className="w-full">
                    <Input
                        isEnabled={!!data?.length}
                        placeholder="Filter..."
                        value={conversationsSorting.filter}
                        onChange={(value) =>
                            updateConversationsSorting({
                                filter: value,
                            })
                        }
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
                                <PromiseState state="createConversation" />
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
        </div>
    );
};

import { ArchivedDisplay } from "@/features/messages/components/conversations/archived/ArchivedDisplay";
import { ConversationDisplay } from "@/features/messages/components/conversations/display/ConversationDisplay";
import { FilterNothing } from "@/features/messages/components/errors/FilterNothing";
import { NoConversations } from "@/features/messages/components/errors/NoConversations";
import { sortConversations } from "@/features/messages/utils/sort";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { useAppStore } from "@/zustand/store";
import { motion } from "motion/react";

type Props = {
    isLoading?: boolean;
    conversations: CacheAPIProtocol["conversations"]["data"] | null;
};
export const List = ({ isLoading, conversations }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const conversationsSorting = useAppStore(
        (state) => state.conversationsSorting,
    );
    const messagesDisplay = useAppStore((state) => state.messagesDisplay);

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

    // splitting conversations into archived / nonarchived
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

    // sorting + filtering + reversing
    const archived = sortConversations({
        conversations: conversationTypes.archived,
        reversed: conversationsSorting.reversed,
        filter: conversationsSorting.filter,
    });
    const regular = sortConversations({
        conversations: conversationTypes.regular,
        reversed: conversationsSorting.reversed,
        filter: conversationsSorting.filter,
    });

    // jsx
    return (
        <div className="flex flex-col relative grow overflow-hidden">
            <motion.ul
                className="flex flex-col gap-1 relative grow"
                animate={{
                    x:
                        messagesDisplay.tabs.conversations !== "conversations"
                            ? "-50%"
                            : 0,
                }}
                transition={{ ease: "easeInOut", duration: 0.3 }}
            >
                <div
                    className={`absolute inset-0 bg-bg-2 z-1 pointer-events-none transition-all duration-500
                        ${messagesDisplay.tabs.conversations !== "conversations" ? "opacity-100" : "opacity-0"}`}
                />

                {regular.length ? (
                    <>
                        {archived.length && (
                            <li>
                                <ArchivedDisplay data={archived} />
                            </li>
                        )}

                        {regular.map((c) => (
                            <li key={c.id}>
                                <ConversationDisplay
                                    data={c}
                                />
                            </li>
                        ))}
                    </>
                ) : (
                    <FilterNothing />
                )}
            </motion.ul>

            <motion.ul
                className="flex flex-col gap-1 absolute inset-0 grow bg-bg-2 z-2"
                initial={false}
                animate={{
                    x:
                        messagesDisplay.tabs.conversations === "archive"
                            ? "0%"
                            : "100%",
                }}
                transition={{ ease: "easeInOut", duration: 0.3 }}
            >
                {archived.length ? (
                    archived.map((c) => (
                        <li key={c.id}>
                            <ConversationDisplay
                                data={c}
                            />
                        </li>
                    ))
                ) : (
                    <FilterNothing />
                )}
            </motion.ul>
        </div>
    );
};

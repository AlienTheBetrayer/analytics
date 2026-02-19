import { ArchivedDisplay } from "@/features/messages/components/conversations/archived/ArchivedDisplay";
import { ConversationDisplay } from "@/features/messages/components/conversations/display/ConversationDisplay";
import { NotesDisplay } from "@/features/messages/components/conversations/notes/NotesDisplay";
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
    const display = useAppStore((state) => state.display.conversations);

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
            if (val.type === "notes") {
                acc.notes = val;
                return acc;
            }

            if (val.conversation_meta?.archived) {
                acc.archived.push(val);
            } else {
                acc.regular.push(val);
            }

            return acc;
        },
        {
            archived: [] as (typeof conversations)[number][],
            regular: [] as (typeof conversations)[number][],
            notes: undefined as (typeof conversations)[number] | undefined,
        },
    );

    // sorting + filtering + reversing
    const archived = sortConversations({
        conversations: conversationTypes.archived,
        reversed: display.reversed,
        filter: display.filter,
    });
    const regular = sortConversations({
        conversations: conversationTypes.regular,
        reversed: display.reversed,
        filter: display.filter,
    });

    // jsx
    return (
        <div className="flex flex-col relative grow overflow-hidden">
            <motion.ul
                className="flex flex-col gap-1 relative grow"
                animate={{
                    x: display.tab !== "conversations" ? "-50%" : 0,
                }}
                transition={{ ease: "easeInOut", duration: 0.3 }}
            >
                <li
                    className={`absolute inset-0 bg-bg-2 z-1 pointer-events-none transition-all duration-500
                        ${display.tab !== "conversations" ? "opacity-100" : "opacity-0"}`}
                />

                {regular.length ? (
                    <>
                        {archived.length && (
                            <li>
                                <ArchivedDisplay data={archived} />
                            </li>
                        )}

                        <li>
                            <NotesDisplay data={conversationTypes.notes} />
                        </li>

                        {regular.map((c) => (
                            <li key={c.id}>
                                <ConversationDisplay data={c} />
                            </li>
                        ))}
                    </>
                ) : (
                    <li className="flex items-center justify-center grow">
                        <FilterNothing type="conversations" />
                    </li>
                )}
            </motion.ul>

            <motion.ul
                className="flex flex-col gap-1 absolute inset-0 grow bg-bg-2 z-2"
                initial={false}
                animate={{
                    x: display.tab === "archive" ? "0%" : "100%",
                }}
                transition={{ ease: "easeInOut", duration: 0.3 }}
            >
                {archived.length ? (
                    archived.map((c) => (
                        <li key={c.id}>
                            <ConversationDisplay data={c} />
                        </li>
                    ))
                ) : (
                    <li className="flex items-center justify-center grow">
                        <FilterNothing type="conversations" />
                    </li>
                )}
            </motion.ul>
        </div>
    );
};

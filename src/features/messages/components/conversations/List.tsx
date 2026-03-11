/** @format */

import { ArchivedDisplay } from "@/features/messages/components/conversations/archived/ArchivedDisplay";
import { ConversationDisplay } from "@/features/messages/components/conversations/display/ConversationDisplay";
import { NotesDisplay } from "@/features/messages/components/conversations/notes/NotesDisplay";
import { useList } from "@/features/messages/components/conversations/useList";
import { FilterNothing } from "@/features/messages/components/errors/FilterNothing";
import { NoConversations } from "@/features/messages/components/errors/NoConversations";
import { useAppStore } from "@/zustand/store";
import { motion } from "motion/react";

export const List = () => {
    // zustand
    const tab = useAppStore((state) => state.display.conversations.tab);

    // splitting + syncing
    const {
        ids: { archivedIds, regularIds, notesId },
        trimmedFilter,
    } = useList();

    // ui states
    const hasConversation = archivedIds.length || regularIds.length || notesId;

    // jsx
    return (
        <div className="flex flex-col relative grow overflow-hidden">
            <motion.ul
                className="flex flex-col gap-1 relative grow scheme-dark h-100 overflow-y-auto"
                style={{ scrollbarWidth: "thin" }}
                animate={{ x: tab !== "conversations" ? "-50%" : "0%" }}
                transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
            >
                {!trimmedFilter && (
                    <>
                        {!!archivedIds.length && (
                            <li>
                                <ArchivedDisplay archivedIds={archivedIds} />
                            </li>
                        )}

                        <li>
                            <NotesDisplay notesId={notesId} />
                        </li>
                    </>
                )}

                {hasConversation ?
                    regularIds.map((id) => (
                        <li key={id}>
                            <ConversationDisplay conversationId={id} />
                        </li>
                    ))
                :   <li className="flex grow items-center justify-center loading">
                        {trimmedFilter ?
                            <FilterNothing type="conversations" />
                        :   <div className="flex flex-col gap-2 p-4 relative items-center justify-center grow">
                                <NoConversations />
                            </div>
                        }
                    </li>
                }
            </motion.ul>

            {/* archived */}
            <motion.ul
                className="flex flex-col gap-1 absolute inset-0 grow bg-bg-2 z-2"
                initial={false}
                animate={{ x: tab === "archive" ? "0%" : "100%" }}
                transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
            >
                {archivedIds.length ?
                    archivedIds.map((id) => (
                        <li key={id}>
                            <ConversationDisplay conversationId={id} />
                        </li>
                    ))
                : !trimmedFilter ?
                    null
                :   <li className="flex items-center justify-center grow">
                        <FilterNothing type="conversations" />
                    </li>
                }
            </motion.ul>
        </div>
    );
};

/** @format */

import { Avatar } from "@/features/messages/components/conversations/display/parts/Avatar";
import { BottomButtons } from "@/features/messages/components/conversations/display/parts/BottomButtons";
import { LastMessage } from "@/features/messages/components/conversations/display/parts/LastMessage";
import { LastMessageDate } from "@/features/messages/components/conversations/display/parts/LastMessageDate";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";

type Props = {
    notesId: string | null;
};

export const NotesDisplay = ({ notesId }: Props) => {
    // url
    const { tab, id } = useParams<{ tab?: string; id?: string }>();

    // zustand
    const conversation = useAppStore((state) => (notesId && state.conversations?.conversations.get(notesId)) || null);

    // ui states
    const isSelected = tab === "notes" || id === notesId;
    const href =
        isSelected ? "/messages/"
        : conversation ? `/messages/c/${conversation.id}`
        : "/messages/notes/";

    // jsx
    return (
        <div className="relative">
            <LinkButton
                className={`box p-4! flex-row! h-20! rounded-4xl! justify-start! items-start! gap-4!
                ${isSelected ? "not-hover:bg-bg-4! hover:border-bg-5!" : "not-hover:bg-bg-1!"}`}
                href={href}
            >
                <Avatar
                    type="notes"
                    conversation={conversation}
                />

                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <div className="grid grid-cols-[auto_25%]">
                        <span>{conversation?.title || "Notes"}</span>
                        <LastMessageDate conversation={conversation} />
                    </div>

                    <LastMessage conversation={conversation} />
                </div>
            </LinkButton>

            <BottomButtons
                conversation={conversation}
                type="notes"
            />
        </div>
    );
};

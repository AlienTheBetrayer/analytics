"use client";

import { Conversations } from "@/features/messages/components/conversations/Conversations";
import { ConversationView } from "@/features/messages/components/message/ConversationView";
import { Topline } from "@/features/messages/components/Topline";
import { useParams } from "next/navigation";

export const Messages = () => {
    const { id } = useParams<{ id?: string }>();

    return (
        <>
            <Topline />

            <div className="box w-full max-w-400 mx-auto min-h-164 p-4! overflow-hidden">
                <div className="grid grid-cols-[30%_1fr] grow gap-4">
                    <Conversations />
                    {<ConversationView conversation_id={id} />}
                </div>
            </div>
        </>
    );
};

"use client";

import { Conversations } from "@/features/messages/components/conversations/Conversations";
import { MessageView } from "@/features/messages/components/message/MessageView";
import { Topline } from "@/features/messages/components/Topline";

export const Messages = () => {
    return (
        <>
            <Topline />

            <div className="box w-full max-w-400 mx-auto min-h-140 p-4! overflow-hidden">
                <div className="grid grid-cols-[30%_1fr] grow gap-4">
                    <Conversations />
                    <MessageView />
                </div>
            </div>
        </>
    );
};

/** @format */

import { MessageView } from "@/features/messages/components/message/MessageView";
import { useParams } from "next/navigation";
import { Conversations } from "@/features/messages/components/conversations/Conversations";
import { AdditionalTopline } from "@/features/messages/components/topline/AdditionalTopline";
import { useRealtime } from "@/features/messages/realtime/useRealtime";
import { useRetrieved } from "@/features/messages/components/useRetrieved";
import { useAppStore } from "@/zustand/store";
import { MessagesTopline } from "@/features/messages/components/message/topline/MessagesTopline";
import { NoteBoard } from "@/features/messages/components/noteboard/NoteBoard";

export type MessagesSelectResult = "url" | "fetch" | "notselected" | "wrong" | "noteboard";
export type MessagesTab = "u" | "c" | "notes" | "none";

export const Select = () => {
    // url
    const { tab } = useParams<{ tab?: string }>();

    // zustand
    const selectDisplay = useAppStore((state) => state.selectDisplay);

    // retrieved fetching + syncing
    useRetrieved();

    // websocket connection
    useRealtime();

    return (
        <div className="flex flex-col gap-4 grow">
            <AdditionalTopline />

            <div className="w-full flex lg:grid lg:grid-cols-[40%_1fr] xl:grid-cols-[30%_1fr] grow gap-4 relative">
                <Conversations />

                <div
                    className={`flex flex-col grow bg-bg-1 ${tab ? "absolute lg:relative inset-0 z-2" : "relative hidden lg:flex"}`}
                >
                    {selectDisplay === "noteboard" ?
                        <article className="flex flex-col bg-bg-2! grow p-4! gap-2 rounded-4xl">
                            <MessagesTopline />
                            <NoteBoard />
                        </article>
                    :   <MessageView />}
                </div>
            </div>
        </div>
    );
};

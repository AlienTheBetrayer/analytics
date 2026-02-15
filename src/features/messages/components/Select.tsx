import { MessageView } from "@/features/messages/components/message/MessageView";
import { useParams } from "next/navigation";
import { useQuery } from "@/query/core";
import { Conversations } from "@/features/messages/components/conversations/Conversations";
import { NotSelected } from "@/features/messages/components/errors/NotSelected";
import { WrongURL } from "@/features/messages/components/errors/WrongURL";
import { useAppStore } from "@/zustand/store";
import { useEffect, useMemo } from "react";

export type MessagesSelectResult = "url" | "fetch" | "notselected" | "wrong";
export type MessagesTab = "u" | "c" | "notes" | "none";

export const Select = () => {
    const { id, tab } = useParams<{ tab?: string; id?: string }>();
    const updateSelectDisplay = useAppStore(
        (state) => state.updateSelectDisplay,
    );
    const updateSelectedConversation = useAppStore(
        (state) => state.updateSelectedConversation,
    );

    // retrieving conversation_id from url if: present id & tab is not already "c"
    const { data: status } = useQuery({ key: ["status"] });
    const { data: retrievedConversation } = useQuery({
        key: ["conversation_retrieve", tab, status?.id, id ?? null],
        trigger: !!((tab !== "c" && id) || tab === "notes"),
    });

    let result: MessagesSelectResult = "notselected";

    switch (tab) {
        case "u": {
            if (!id) {
                result = "wrong";
                break;
            }

            result = "fetch";
            break;
        }
        case "c": {
            if (!id) {
                result = "wrong";
                break;
            }

            result = "url";
            break;
        }
        case "notes": {
            result = "fetch";
            break;
        }
        default: {
            result = "notselected";
            break;
        }
    }

    const retrieved = useMemo(() => {
        return tab === "c"
            ? {
                  conversation_id: id,
                  user: undefined,
              }
            : (retrievedConversation ?? undefined);
    }, [id, retrievedConversation, tab]);

    useEffect(() => {
        updateSelectDisplay(result);
    }, [result, updateSelectDisplay]);

    useEffect(() => {
        updateSelectedConversation(retrieved?.conversation_id ?? null);
    }, [retrieved, updateSelectedConversation]);

    // wrong result
    if (result === "notselected" || result === "wrong") {
        return (
            <div className="grid grid-cols-[30%_1fr] grow gap-4">
                <Conversations />

                <div className="flex items-center justify-center relative grow loading">
                    {result === "notselected" ? <NotSelected /> : <WrongURL />}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-[30%_1fr] grow gap-4">
            <Conversations />
            <MessageView retrieved={retrieved} />
        </div>
    );
};

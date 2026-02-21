import { MessageView } from "@/features/messages/components/message/MessageView";
import { useParams } from "next/navigation";
import { useQuery } from "@/query/core";
import { Conversations } from "@/features/messages/components/conversations/Conversations";
import { useAppStore } from "@/zustand/store";
import { useEffect, useMemo } from "react";

export type MessagesSelectResult =
    | "url"
    | "fetch"
    | "notselected"
    | "wrong"
    | "noteboard";
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
            if (id === "board") {
                result = "noteboard";
                break;
            }
            result = "fetch";
            break;
        }
        default: {
            result = "notselected";
            break;
        }
    }

    // fetching
    const { data: retrievedConversation } = useQuery({
        key: ["conversation_retrieve", tab, status?.id, id ?? null],
        trigger: result === "fetch",
    });
    console.log(["conversation_retrieve", tab, status?.id, id ?? null]);

    const retrieved = useMemo(() => {
        return tab === "c"
            ? {
                  conversation_id: id,
                  user: undefined,
              }
            : (retrievedConversation ?? undefined);
    }, [id, retrievedConversation, tab]);

    // syncing
    useEffect(() => {
        updateSelectDisplay(result);
    }, [result, updateSelectDisplay]);

    useEffect(() => {
        updateSelectedConversation(retrieved?.conversation_id ?? null);
    }, [retrieved, updateSelectedConversation]);

    return (
        <div className="w-full flex lg:grid lg:grid-cols-[40%_1fr] xl:grid-cols-[30%_1fr] grow gap-4 relative">
            <Conversations />

            <div
                className={`flex flex-col grow bg-bg-1 ${tab ? "absolute lg:static inset-0 z-2" : ""}`}
            >
                <MessageView retrieved={retrieved} />
            </div>
        </div>
    );
};

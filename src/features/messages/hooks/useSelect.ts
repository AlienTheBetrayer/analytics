import { MessagesSelectResult } from "@/features/messages/components/Select";
import { useQuery } from "@/query/core";
import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export const useSelect = () => {
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

    return useMemo(() => {
        return {
            retrieved,
        };
    }, [retrieved]);
};

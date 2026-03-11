/** @format */

import { MessagesSelectResult } from "@/features/messages/components/Select";
import { useQuery } from "@/query/core";
import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export const useRetrieved = () => {
    // status
    const { data: status } = useQuery({ key: ["status"] });

    // url
    const { id, tab } = useParams<{ tab?: string; id?: string }>();

    // zustand
    const updateSelectDisplay = useAppStore((state) => state.updateSelectDisplay);
    const updateRetrieved = useAppStore((state) => state.updateRetrieved);

    // determining the outcome
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

    // return state
    const retrieved = useMemo(() => {
        return tab === "c" ?
                {
                    conversation_id: id,
                    user: undefined,
                }
            :   (retrievedConversation ?? undefined);
    }, [id, retrievedConversation, tab]);

    // syncing
    useEffect(() => {
        updateSelectDisplay(result);
    }, [result, updateSelectDisplay]);

    useEffect(() => {
        updateRetrieved(retrieved ?? null);
    }, [retrieved, updateRetrieved]);

    // returning
    return useMemo(() => {
        return {
            retrieved,
        };
    }, [retrieved]);
};

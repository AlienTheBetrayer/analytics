/** @format */

import { useQuery } from "@/query/core";
import { useState, useMemo } from "react";

export const useForwarding = () => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data: conversations, isLoading } = useQuery({
        key: ["conversations", status?.id],
    });

    // filtering
    const [filter, setFilter] = useState<string>("");
    const conversationIds = useMemo(() => {
        const conversationIds: string[] = [];

        if (!conversations?.ids.length) {
            return conversationIds;
        }

        const trimmedFilter = filter.trim().toLowerCase();

        if (!trimmedFilter) {
            return conversations.ids;
        }

        for (const id of conversations.ids) {
            const c = conversations.conversations.get(id);

            if (!c) {
                continue;
            }

            if (c.title?.toLowerCase().trim().includes(trimmedFilter)) {
                conversationIds.push(id);
            }
        }

        return conversationIds;
    }, [filter, conversations]);

    return useMemo(() => {
        return { conversationIds, isLoading, filter, setFilter };
    }, [conversationIds, isLoading, filter]);
};

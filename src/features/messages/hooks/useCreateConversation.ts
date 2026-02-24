import { wrapPromise } from "@/promises/core";
import { upsertConversation } from "@/query-api/calls/conversation";
import { useQuery } from "@/query/core";
import { useCallback, useMemo } from "react";

export const useCreateConversation = () => {
    const { data: status } = useQuery({ key: ["status"] });

    const create = useCallback(
        (
            options: (
                | {
                      type: "dm" | "channel" | "group";
                      ids: string[];
                  }
                | { type: "notes" }
            ) & { title?: string; description?: string; image?: File },
        ) => {
            if (!status) {
                return;
            }

            switch (options.type) {
                case "notes": {
                    wrapPromise("createConversation", async () => {
                        return upsertConversation({
                            type: "create",
                            conversation_type: "notes",
                            ...(options.title && { title: options.title }),
                            ...(options.description && {
                                description: options.description,
                            }),
                            ...(options.image && { image: options.image }),
                            user: status,
                            member_ids: [],
                        });
                    });
                    break;
                }
                default: {
                    if (options.ids.some((id) => id === status.id)) {
                        return;
                    }

                    wrapPromise("createConversation", async () => {
                        return upsertConversation({
                            type: "create",
                            conversation_type: "group",
                            user: status,
                            member_ids: options.ids,
                            ...(options.image && { image: options.image }),
                            ...(options.title && { title: options.title }),
                            ...(options.description && {
                                description: options.description,
                            }),
                        });
                    });
                    break;
                }
            }
        },
        [status],
    );

    return useMemo(() => {
        return {
            create,
        };
    }, [create]);
};

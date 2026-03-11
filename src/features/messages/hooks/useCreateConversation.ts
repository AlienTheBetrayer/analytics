/** @format */

import { wrapPromise } from "@/promises/core";
import { upsertConversation } from "@/query-api/calls/conversation";
import { useQuery } from "@/query/core";
import { useCallback, useMemo } from "react";

export const useCreateConversation = () => {
    // status
    const { data: status } = useQuery({ key: ["status"] });

    // function
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
            wrapPromise("createConversation", async () => {
                if (options.type !== "notes" && options.ids.some((id) => id === status?.id)) {
                    return Promise.reject();
                }

                return upsertConversation({
                    type: "create",
                    conversation_type: options.type,
                    ...(options.title && { title: options.title }),
                    ...(options.description && {
                        description: options.description,
                    }),
                    ...(options.image && { image: options.image }),
                    member_ids: options.type === "notes" ? [] : options.ids,
                });
            });
        },
        [status],
    );

    // returning
    return useMemo(() => {
        return {
            create,
        };
    }, [create]);
};

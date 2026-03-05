import { queryMutate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import { Message } from "@/types/tables/messages";
import { supabaseClient } from "@/utils/server/public/supabase";
import { useEffect } from "react";

export const useRealtime = (id: string | undefined) => {
    const { data: status } = useQuery({ key: ["status"] });

    useEffect(() => {
        if (!id) {
            return;
        }

        const channel = supabaseClient
            .channel(`conversation-${id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${id}`,
                },
                (payload) => {
                    const message = (
                        payload.eventType === "DELETE"
                            ? payload.old
                            : payload.new
                    ) as Message | undefined;
                    console.log(message);

                    if (!message || !status || message.user_id === status.id) {
                        return;
                    }

                    switch (payload.eventType) {
                        case "INSERT": {
                            break;
                        }
                        case "UPDATE": {
                            queryMutate({
                                key: ["messages", message.conversation_id],
                                value: (state) =>
                                    state.map((m) =>
                                        m.id === message.id
                                            ? {
                                                  ...m,
                                                  message: message.message,
                                                  edited_at:
                                                      new Date().toISOString(),
                                              }
                                            : m,
                                    ),
                            });
                            break;
                        }
                        case "DELETE": {
                            queryMutate({
                                key: ["messages", message.conversation_id],
                                value: (state) =>
                                    state.filter((m) => m.id !== message.id),
                            });
                            break;
                        }
                    }
                },
            )
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [id, status]);
};

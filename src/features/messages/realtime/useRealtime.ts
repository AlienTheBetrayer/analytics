/* eslint-disable react-hooks/exhaustive-deps */
import { handleRealtimeConversation } from "@/features/messages/realtime/channels/conversation";
import { handleRealtimeMember } from "@/features/messages/realtime/channels/member";
import { handleRealtimeMessage } from "@/features/messages/realtime/channels/messages";
import { useQuery } from "@/query/core";
import { supabaseClient } from "@/utils/server/public/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useMemo, useRef } from "react";

export type RealtimeBroadcastEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

type RealtimeBroadcastChannel = {
    name: string;
    fn: (payload: unknown) => void;
};

export const useRealtime = () => {
    // status
    const { data: status } = useQuery({ key: ["status"] });

    // all realtime channels
    const channels: RealtimeBroadcastChannel[] = useMemo(() => {
        if (!status) {
            return [];
        }

        return [
            {
                name: `realtime:messages:${status.id}`,
                fn: (payload) => {
                    handleRealtimeMessage(status.id, payload as Parameters<typeof handleRealtimeMessage>["1"]);
                },
            },
            {
                name: `realtime:member:${status.id}`,
                fn: (payload) => {
                    handleRealtimeMember(status.id, payload as Parameters<typeof handleRealtimeMember>["1"]);
                },
            },
            {
                name: `realtime:conversation:${status.id}`,
                fn: (payload) => {
                    handleRealtimeConversation(
                        status.id,
                        payload as Parameters<typeof handleRealtimeConversation>["1"],
                    );
                },
            },
        ] as RealtimeBroadcastChannel[];
    }, [status]);

    // currently subscribed
    const channelRefs = useRef<Map<string, RealtimeChannel>>(new Map());

    // handling channels
    useEffect(() => {
        channels.forEach((c) => {
            if (channelRefs.current.has(c.name)) {
                return;
            }

            const channel = supabaseClient.channel(c.name).on("broadcast", { event: "*" }, c.fn).subscribe();

            channelRefs.current.set(c.name, channel);
        });

        return () => {
            channels.forEach((c) => {
                const channel = channelRefs.current.get(c.name);

                if (channel) {
                    supabaseClient.removeChannel(channel);
                    channelRefs.current.delete(c.name);
                }
            });
        };
    }, [channels]);
};

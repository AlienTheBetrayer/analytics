import { handleRealtimeMember, RealtimePayloadMember } from "@/features/messages/realtime/channels/member";
import { handleRealtimeMessage, RealtimePayloadMessage } from "@/features/messages/realtime/channels/messages";
import { useQuery } from "@/query/core";
import { supabaseClient } from "@/utils/server/public/supabase";
import { useEffect } from "react";

export const useRealtime = () => {
    const { data: status } = useQuery({ key: ["status"] });

    useEffect(() => {
        if (!status) {
            return;
        }

        const messageChannel = supabaseClient
            .channel(`realtime:messages:${status.id}`)
            .on(
                "broadcast",
                {
                    event: "*",
                },
                (payload: RealtimePayloadMessage) => {
                    handleRealtimeMessage(status.id, payload);
                },
            )
            .subscribe();

        const memberChannel = supabaseClient
            .channel(`realtime:member:${status.id}`)
            .on("broadcast", { event: "*" }, (payload: RealtimePayloadMember) => {
                handleRealtimeMember(status.id, payload);
            })
            .subscribe();

        return () => {
            supabaseClient.removeChannel(messageChannel);
            supabaseClient.removeChannel(memberChannel);
        };
    }, [status]);
};

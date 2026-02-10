import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const sendMessage = async (
    options: (
        | { type: "start_dm"; from_id: string; to_id: string }
        | { type: "send"; from_id: string; conversation_id: string }
    ) & { message: string },
) => {
    switch (options.type) {
        case "start_dm": {
            return await refreshedRequest({
                route: "/api/update/message-send",
                method: "POST",
                body: {
                    from_id: options.from_id,
                    to_id: options.to_id,
                    message: options.message,
                },
            });
        }
        case "send": {
            return await refreshedRequest({
                route: "/api/update/message-send",
                method: "POST",
                body: {
                    from_id: options.from_id,
                    conversation_id: options.conversation_id,
                    message: options.message,
                },
            });
        }
    }
};

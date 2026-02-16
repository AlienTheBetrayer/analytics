import { CacheAPIFunctions } from "@/query-api/protocol";
import { __contact } from "@/query-api/utils";
import { ContactMessage } from "@/types/tables/contact";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

/**
 * state
 */
export type CacheAPIProtocolContact = {
    contact_messages: {
        key: ["contact_messages", string];
        data: string[];
    };
    contact_message: {
        key: ["contact_message", string];
        data: ContactMessage;
    };
};

/**
 * functions
 */
export const CacheAPIFunctionsContact: CacheAPIFunctions<CacheAPIProtocolContact> =
    {
        contact_messages: async (args: unknown[]) => {
            const ids = (
                await refreshedRequest({
                    route: "/api/get/contact_messages",
                    method: "GET",
                    config: { params: { user_id: args[0] } },
                })
            ).data.ids as string[];

            if (ids?.length) {
                await __contact("all", ids);
            }

            return ids;
        },
        contact_message: async (args: unknown[]) => {
            if (!args[0] || typeof args[0] !== "string") {
                throw new Error("message_id are undefined");
            }

            return (await __contact("single", [args[0]]))?.[0];
        },
    };

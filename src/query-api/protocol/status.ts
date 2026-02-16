import { CacheAPIFunctions } from "@/query-api/protocol";
import { AuthenticationToken } from "@/types/auth/authentication";
import { Token } from "@/types/tables/auth";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";
import axios from "axios";

/**
 * state
 */
export type CacheAPIProtocolStatus = {
    status: {
        key: ["status"];
        data: AuthenticationToken;
    };
    sessions: {
        key: ["sessions", string];
        data: Record<string, Token>;
    };
};

/**
 * functions
 */
export const CacheAPIFunctionsStatus: CacheAPIFunctions<CacheAPIProtocolStatus> =
    {
        status: async () => {
            return (await axios.get("/api/auth/status")).data.status;
        },
        sessions: async (args: unknown[]) => {
            if (!args[0]) {
                throw new Error("user_id is undefined");
            }

            return (
                await refreshedRequest({
                    route: "/api/get/sessions",
                    method: "GET",
                    config: { params: { user_id: args[0] } },
                })
            ).data.sessions;
        },
    };

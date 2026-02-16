import { AuthenticationToken } from "@/types/auth/authentication";
import { Token } from "@/types/tables/auth";

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

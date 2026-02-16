import { CacheAPIProtocolContact } from "@/query-api/protocol/contact";
import { CacheAPIProtocolDashboard } from "@/query-api/protocol/dashboard";
import { CacheAPIProtocolMessages } from "@/query-api/protocol/messages";
import { CacheAPIProtocolNoteboard } from "@/query-api/protocol/noteboard";
import { CacheAPIProtocolPosts } from "@/query-api/protocol/posts";
import { CacheAPIProtocolSearch } from "@/query-api/protocol/search";
import { CacheAPIProtocolStatus } from "@/query-api/protocol/status";
import { CacheAPIProtocolUser } from "@/query-api/protocol/user";
import { CacheValue } from "@/query/types/types";

/**
 * type for protocol functions
 * @param T CacheAPIProtocol sub-object
 */
export type CacheAPIFunctions<T> = Record<
    keyof T,
    (args: unknown[]) => Promise<CacheValue>
>;

/**
 * type for values along with their respective keys
 */
export type CacheAPIProtocol = CacheAPIProtocolContact &
    CacheAPIProtocolDashboard &
    CacheAPIProtocolMessages &
    CacheAPIProtocolPosts &
    CacheAPIProtocolSearch &
    CacheAPIProtocolUser &
    CacheAPIProtocolStatus &
    CacheAPIProtocolNoteboard;

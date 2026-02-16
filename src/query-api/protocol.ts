import { CacheAPIProtocolContact } from "@/query-api/protocol/contact";
import { CacheAPIProtocolDashboard } from "@/query-api/protocol/dashboard";
import { CacheAPIProtocolMessages } from "@/query-api/protocol/messages";
import { CacheAPIProtocolNoteboard } from "@/query-api/protocol/noteboard";
import { CacheAPIProtocolPosts } from "@/query-api/protocol/posts";
import { CacheAPIProtocolSearch } from "@/query-api/protocol/search";
import { CacheAPIProtocolStatus } from "@/query-api/protocol/status";
import { CacheAPIProtocolUser } from "@/query-api/protocol/user";

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

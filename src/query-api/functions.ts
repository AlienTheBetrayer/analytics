import { CacheAPIFunctionsContact } from "@/query-api/protocol/contact";
import { CacheAPIFunctionsDashboard } from "@/query-api/protocol/dashboard";
import { CacheAPIProtocolInvitations } from "@/query-api/protocol/invitations";
import { CacheAPIFunctionsMessages } from "@/query-api/protocol/messages";
import { CacheAPIFunctionsNoteboard } from "@/query-api/protocol/noteboard";
import { CacheAPIFunctionsPosts } from "@/query-api/protocol/posts";
import { CacheAPIFunctionsSearch } from "@/query-api/protocol/search";
import { CacheAPIFunctionsStatus } from "@/query-api/protocol/status";
import { CacheAPIFunctionsUser } from "@/query-api/protocol/user";
import { CacheKey, CacheKeyEntity, CacheValue } from "@/query/types/types";

export const CacheAPIFunctions: Record<
    CacheKeyEntity,
    (args: unknown[]) => Promise<CacheValue>
> = {
    ...CacheAPIFunctionsUser,
    ...CacheAPIFunctionsContact,
    ...CacheAPIFunctionsDashboard,
    ...CacheAPIFunctionsMessages,
    ...CacheAPIFunctionsNoteboard,
    ...CacheAPIFunctionsPosts,
    ...CacheAPIFunctionsSearch,
    ...CacheAPIFunctionsStatus,
    ...CacheAPIProtocolInvitations,
};

/**
 * resolves and calls an official function with the given key and returns the value from it
 * @param key array-like key
 * @returns a promise with the value from the function from the key
 */
export const resolveAPIFunction = async (options: { key: CacheKey }) => {
    const [entity, ...args] = options.key;
    const handler = CacheAPIFunctions[entity];

    if (!handler) {
        throw new Error(
            `No handler defined for entity: ${entity} with args: ${args}`,
        );
    }

    return handler(args);
};

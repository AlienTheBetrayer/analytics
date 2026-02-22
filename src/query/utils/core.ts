import {
    queryCache,
    queryLoadingStates,
    queryErrorStates,
    queryPromises,
    queryListeners,
} from "@/query/init";
import { QueryConfig } from "@/query/types/config";
import { resolveAPIFunction } from "@/query-api/functions";
import { CacheKey } from "@/query/types/types";

/**
 * performs an API request at a specific key with a specific function
 * @param key
 * @param fn
 * @returns fetch's response
 */
export const queryFetch = async <T extends CacheKey>({
    key,
    ignoreCache,
}: {
    key: QueryConfig<T>["key"];
    ignoreCache?: boolean;
}) => {
    // deduplication & optimized caching
    if (queryCache.has({ key }) && ignoreCache !== true) {
        return Promise.resolve(queryCache.get({ key }));
    }

    if (queryPromises.has({ key })) {
        return queryPromises.get({ key });
    }

    queryLoadingStates.set({ key, flag: true });

    // fetching
    const promise = resolveAPIFunction({ key })
        .then((response) => {
            queryCache.set({ key, value: response });
            queryListeners.fire({ key, type: "update", value: response });
            return response;
        })
        .catch((error) => {
            console.error(error);
            queryErrorStates.set({ key, error });
            throw error;
        })
        .finally(() => {
            queryLoadingStates.set({ key, flag: false });
            queryPromises.delete({ key });
        });

    queryPromises.set({ key, promise });
    return promise;
};

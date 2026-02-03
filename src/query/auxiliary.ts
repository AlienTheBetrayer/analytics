import { queryCache, queryListeners } from "@/query/init";
import { CacheKey, CacheAPIValue } from "@/query/types/types";

/**
 * manually set the explicit data (reactively propagates to all components)
 * @param key array-like key of the data
 * @param value new value
 */
export const queryMutate = <T extends CacheKey>(config: {
    key: T;
    value:
        | CacheAPIValue<T>["data"]
        | ((state: CacheAPIValue<T>["data"]) => CacheAPIValue<T>["data"]);
}) => {
    const value =
        typeof config.value === "function"
            ? config.value(
                  queryCache.get({
                      key: config.key,
                  }) as CacheAPIValue<T>["data"],
              )
            : config.value;

    queryCache.set({ key: config.key, value });
    queryListeners.fire({
        key: config.key,
        value,
        type: "update",
    });
};

export const queryDelete = <T extends CacheKey>(config: { key: T }) => {
    queryCache.delete({ key: config.key });
    queryListeners.fire({
        key: config.key,
        value: null,
        type: "update",
    });
};

/**
 * re-fetches the data at a specific key using the pre-defined fn
 * @param key array-like key of data
 * @param silent whether to trigger the isLoading before fetch
 */
export const queryInvalidate = <T extends CacheKey>(config: {
    key: T;
    silent?: boolean;
}) => {
    queryCache.delete({ key: config.key });
    queryListeners.fire({
        key: config.key,
        type: "refetch",
        silent: config.silent ?? true,
    });
};

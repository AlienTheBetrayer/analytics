import { CacheKey, CacheAPIValue } from "@/query/types/types";

/**
 * config object for main query function
 */
export type QueryConfig<T extends CacheKey> = {
    /**
     * array-like key to cache data by (VITAL: try to make it atomic, first value can be entity's type, second value can be an id of some sort)
     */
    key: T;

    /**
     * initial state if nothing exists in the cache yet (or hasn't fetched)
     */
    initial?: CacheAPIValue<T>["data"];

    /**
     * wait until this trigger becomes truthy to fetch (useful for safe data fetch chains,
     * convert any data object with !! and feed into this)
     */
    trigger?: boolean;
};

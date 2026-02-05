import { CacheKey, CacheValue } from "@/query/types/types";
import { convertKey } from "@/query/utils/other";

/**
 * class used for caching API routes with their respective ongoing promises
 */
export class QueryPromises {
    private _data: Record<string, Promise<CacheValue>> = {};

    /**
     * constructs the Loading instance
     */
    constructor() {}

    /**
     * accesses and retrieves data at a specific key
     * @param key array-like key
     * @returns value at that key inside the loading cache
     */
    get(options: { key: CacheKey }): Promise<CacheValue> {
        return this._data[convertKey(options.key)];
    }

    /**
     * sets data at a specific key
     * @param key array-like key
     * @param promise new promise at the key
     */
    set(options: { key: CacheKey; promise: Promise<CacheValue> }): void {
        this._data[convertKey(options.key)] = options.promise;
    }

    /**
     * checks whether the value is in the cache (works for false too)
     * @param key array-like key
     * @returns whether the key exists
     */
    has(options: { key: CacheKey }): boolean {
        return convertKey(options.key) in this._data;
    }

    /**
     * clears all data in the cache
     */
    wipe(): void {
        this._data = {};
    }

    /**
     * deletes data at a specific key
     * @param key array-like key
     */
    delete(options: { key: CacheKey }): void {
        delete this._data[convertKey(options.key)];
    }
}

import { CacheKey, CacheValue } from "@/query/types/types";
import { convertKey } from "@/query/utils/other";

/**
 * class used for caching API routes with their respective JSON
 */
export class QueryCache {
    private _data: Record<string, CacheValue> = {};

    /**
     * constructs the Cache instance
     */
    constructor() {}

    /**
     * accesses and retrieves data at a specific key
     * @param key array-like key
     * @returns value at that key inside the cache
     */
    get(options: { key: CacheKey }): CacheValue {
        return this._data[convertKey(options.key)];
    }

    /**
     * sets data at a specific key
     * @param key array-like key
     * @param value new value at the key
     */
    set(options: { key: CacheKey; value: CacheValue }): void {
        this._data[convertKey(options.key)] = options.value;
    }

    /**
     * checks whether the value is in the cache (works for null and undefined too)
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

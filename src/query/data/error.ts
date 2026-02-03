import { CacheKey } from "@/query/types/protocol";
import { convertKey } from "@/query/utils/other";

/**
 * class used for caching API routes with their respective errors
 */
export class QueryErrorStates {
    private _data: Record<string, Error> = {};

    /**
     * constructs the Loading instance
     */
    constructor() {}

    /**
     * accesses and retrieves data at a specific key
     * @param key array-like key
     * @returns value at that key inside the loading cache
     */
    get(options: { key: CacheKey }): Error {
        return this._data[convertKey(options.key)];
    }

    /**
     * sets data at a specific key
     * @param key array-like key
     * @param error new error at the key
     */
    set(options: { key: CacheKey; error: Error }): void {
        this._data[convertKey(options.key)] = options.error;
    }

    /**
     * checks whether the value is in the loading cache (works for false too)
     * @param key array-like key
     * @returns whether the key exists
     */
    has(options: { key: CacheKey }): boolean {
        return convertKey(options.key) in this._data;
    }

    /**
     * clears all data in the loading cache
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

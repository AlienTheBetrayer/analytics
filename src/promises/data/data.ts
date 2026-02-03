import { promiseListeners } from "@/promises/data/init";
import { PromiseKey, PromiseStatus } from "@/promises/types";

/**
 * class used for caching API routes with their respective JSON
 */
export class PromiseStates {
    private _data: Record<PromiseKey, PromiseStatus> = {};

    /**
     * constructs the Cache instance
     */
    constructor() {}

    /**
     * accesses and retrieves data at a specific key
     * @param key array-like key
     * @returns value at that key inside the cache
     */
    get(options: { key: PromiseKey }): PromiseStatus {
        return this._data[options.key];
    }

    /**
     * sets data at a specific key
     * @param key array-like key
     * @param value new value at the key
     */
    set(options: { key: PromiseKey; status: PromiseStatus }): void {
        this._data[options.key] = options.status;
        promiseListeners.fire({ key: options.key, status: options.status });
    }

    /**
     * checks whether the value is in the cache
     * @param key array-like key
     * @returns whether the key exists
     */
    has(options: { key: PromiseKey }): boolean {
        return options.key in this._data;
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
    delete(options: { key: PromiseKey }): void {
        delete this._data[options.key];
    }
}

import { CacheKey } from "@/query/types/protocol";
import { CacheListener, CacheListenerOptions } from "@/query/types/types";
import { convertKey } from "@/query/utils/other";

/**
 * class used for caching API routes with their respective listeners
 */
export class QueryListeners {
    private _data: Record<string, Set<CacheListener>> = {};

    /**
     * constructs the Loading instance
     */
    constructor() {}

    /**
     * attaches unique listener for a specific key
     * @param key array-like key
     * @param fn new value at the key
     */
    attach(options: { key: CacheKey; fn: CacheListener }): void {
        const k = convertKey(options.key);

        if (!(k in this._data)) {
            this._data[k] = new Set();
        }
        this._data[k].add(options.fn);
    }

    /**
     * detaches the listener from a specific key
     * @param key the key to remove the listene from
     * @param fn listener at the key that needs to be removed
     */
    detach(options: { key: CacheKey; fn: CacheListener }): void {
        const k = convertKey(options.key);

        this._data[k]?.delete(options.fn);
        if (!this._data[k]?.size) {
            delete this._data[k];
        }
    }

    /**
     * fires all listeners in the specific key
     * @param key the key that will get its listeners fired
     */
    fire(
        options: {
            key: CacheKey;
        } & CacheListenerOptions,
    ): void {
        this._data[convertKey(options.key)]?.forEach((fn) => {
            switch (options.type) {
                case "refetch": {
                    fn({ type: options.type, silent: options.silent });
                    break;
                }
                case "update": {
                    fn({ type: options.type, value: options.value });
                    break;
                }
            }
        });
    }

    /**
     * checks whether the value is in the listeners cache (works for false too)
     * @param key array-like key
     * @returns whether the key exists
     */
    has(options: { key: CacheKey }): boolean {
        return convertKey(options.key) in this._data;
    }

    /**
     * clears all data in the subscriber cache
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

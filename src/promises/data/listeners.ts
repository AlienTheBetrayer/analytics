import { PromiseKey, PromiseStatus } from "@/promises/types";

/**
 * class used for caching API routes with their respective JSON
 */
export class PromiseListeners {
    private _data: Record<PromiseKey, Set<(status: PromiseStatus) => void>> =
        {};

    /**
     * constructs the Cache instance
     */
    constructor() {}

    /**
     * attaches a function to the global listener state
     * @param key key to listen to
     * @param fn function to be called upon status change
     */
    attach(options: { key: PromiseKey; fn: (status: PromiseStatus) => void }) {
        if (!(options.key in this._data)) {
            this._data[options.key] = new Set();
        }

        this._data[options.key]?.add(options.fn);
    }

    /**
     * detaches a function from global listener state
     * @param key key to listen to
     * @param fn function to be called upon status change
     */
    detach(options: { key: PromiseKey; fn: (status: PromiseStatus) => void }) {
        this._data[options.key]?.delete(options.fn);

        if (!this._data[options.key]?.size) {
            delete this._data[options.key];
        }
    }

    /**
     * fires all functions within the same key
     * @param key the key to fire all functions in
     */
    fire(options: { key: PromiseKey; status: PromiseStatus }) {
        this._data[options.key]?.forEach((fn) => fn(options.status));
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

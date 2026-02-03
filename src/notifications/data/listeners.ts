import { PromiseKey } from "@/promises/types";
import { NotificationData } from "@/types/other/notifications";

/**
 * class used for caching API routes with their respective JSON
 */
export class NotificationListeners {
    private _data: Record<
        string,
        Set<(notification: NotificationData) => void>
    > = {};

    /**
     * constructs the Cache instance
     */
    constructor() {}

    /**
     * attaches a function to the global listener state
     * @param key key to listen to
     * @param fn function to be called upon status change
     */
    attach(options: {
        key: PromiseKey;
        fn: (notification: NotificationData) => void;
    }) {
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
    detach(options: {
        key: PromiseKey;
        fn: (notification: NotificationData) => void;
    }) {
        this._data[options.key]?.delete(options.fn);

        if (!this._data[options.key]?.size) {
            delete this._data[options.key];
        }
    }

    /**
     * fires all functions within the same key
     * @param key the key to fire all functions in
     */
    fire(options: { key: string; notification: NotificationData }) {
        this._data[options.key]?.forEach((fn) => fn(options.notification));
    }

    /**
     * checks whether the value is in the cache
     * @param key array-like key
     * @returns whether the key exists
     */
    has(options: { key: string }): boolean {
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
    delete(options: { key: string }): void {
        delete this._data[options.key];
    }
}

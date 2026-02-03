import { promiseStates } from "@/promises/data/init";

/**
 * wraps the asynchronous function and allows you to globally observe the status from other components
 * @param key unique key that identifies the promise
 * @param fn function that is going to be wrapped
 */
export const wrapPromise = async <T>(key: string, fn: () => Promise<T>) => {
    promiseStates.set({ key, status: "idle" });

    try {
        promiseStates.set({ key, status: "pending" });
        await fn();
        promiseStates.set({ key, status: "resolved" });
    } catch {
        promiseStates.set({ key, status: "rejected" });
    }
};

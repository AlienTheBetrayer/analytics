import { useEffect, useState } from "react";

/**
 * watches a reactive value and makes it debounced
 * @param value the value this hook should watch
 * @param delayMs how many milliseconds to wait before an update happens
 * @returns debounced state
 */
export const useDebounced = <T>(value: T, delayMs: number = 300) => {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounced(value);
        }, delayMs ?? 500);

        return () => clearTimeout(timeout);
    }, [value, delayMs]);

    return debounced;
};

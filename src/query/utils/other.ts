import { CacheKey } from "@/query/types/protocol";

/**
 * safely converts an array-like key to a cache-ready key. throws an error if the key is not valid
 */
export const convertKey = (key: CacheKey): string => {
    if (
        !key.length ||
        !key.every((v) => (typeof v === "string" ? v.trim().length > 0 : true))
    ) {
        throw new Error("[key] must have valid elements");
    }

    return key.join(";");
};

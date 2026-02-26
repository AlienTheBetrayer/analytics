/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * helper type that recursively makes everything partial
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? DeepPartial<U>[]
        : T[P] extends object
          ? DeepPartial<T[P]>
          : T[P];
};

/**
 * safely merges the object with a deep partial copy
 * @param target the object we want to mutate
 * @param source a few properties from the deep partial
 * @returns merged object
 */
export const deepMerge = <T extends object>(
    target: T,
    source: DeepPartial<T>,
): T => {
    // If source is null or not an object, it can't be merged
    if (!source || typeof source !== "object") {
        return source as T;
    }

    const output = { ...target };

    for (const key in source) {
        const sourceValue = source[key];
        const targetValue = (target as any)[key];

        // sets
        if (sourceValue instanceof Set) {
            (output as any)[key] = new Set(sourceValue);
            continue;
        }

        // maps
        if (sourceValue instanceof Map) {
            (output as any)[key] = new Map(sourceValue);
            continue;
        }

        // dates
        if (sourceValue instanceof Date) {
            (output as any)[key] = new Date(sourceValue.getTime());
            continue;
        }

        // plain objects
        if (
            sourceValue &&
            typeof sourceValue === "object" &&
            !Array.isArray(sourceValue) &&
            targetValue &&
            typeof targetValue === "object" &&
            !(
                targetValue instanceof Set ||
                targetValue instanceof Map ||
                targetValue instanceof Date
            )
        ) {
            (output as any)[key] = deepMerge(targetValue, sourceValue);
        }
        // arrays / other
        else if (sourceValue !== undefined) {
            (output as any)[key] = sourceValue;
        }
    }

    return output;
};

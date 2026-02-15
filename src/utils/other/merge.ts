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
    const output = { ...target };

    for (const key in source) {
        const sourceValue = source[key];
        const targetValue = target[key];

        if (
            sourceValue &&
            typeof sourceValue === "object" &&
            !Array.isArray(sourceValue) &&
            targetValue &&
            typeof targetValue === "object"
        ) {
            (output as any)[key] = deepMerge(targetValue, sourceValue);
        } else if (sourceValue !== undefined) {
            (output as any)[key] = sourceValue;
        }
    }

    return output;
};

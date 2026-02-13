/**
 * type for any value within the cache
 */
export type CacheValue = object | string | number | boolean | null | undefined;

/**
 * type for a data listener within the cache
 */
export type CacheListenerOptions =
    | {
          type: "update";
          value: CacheValue;
      }
    | { type: "refetch"; silent: boolean };

export type CacheListener = (options: CacheListenerOptions) => void;

import { CacheAPIProtocol } from "@/query-api/protocol";

/**
 * type for a key within the cache
 */
export type CacheKeyEntity = keyof CacheAPIProtocol;
export type CacheKey = [
    CacheKeyEntity,
    ...(string | number | undefined | null)[],
];

/**
 * type for a value within the cache
 */
export type CacheAPIValue<T extends CacheKey> = T extends [
    infer A,
    ...unknown[],
]
    ? A extends keyof CacheAPIProtocol
        ? CacheAPIProtocol[A]
        : never
    : never;

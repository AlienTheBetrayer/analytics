// types to help with the zustand's initializer

import type { StoreType } from "@/zustand/store";

/**
 * set() function in zustand
 */
export type SetType<T> = (partial: (state: T) => T) => void;

/**
 * get() function in zustand
 */
export type GetType<T> = () => T;

/**
 * a function that returns a specific slice but is capable to use the whole data store
 */
export type SliceFunction<T, U = StoreType> = (set: SetType<U>, get: GetType<U>) => T;
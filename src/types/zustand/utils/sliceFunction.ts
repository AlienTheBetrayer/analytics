// types to help with the zustand's initializer

import type { StoreType } from "@/zustand/store";

export type SetType<T> = (partial: (state: T) => T) => void;
export type GetType<T> = () => T;

export type SliceFunction<T, U = StoreType> = (set: SetType<U>, get: GetType<U>) => T;
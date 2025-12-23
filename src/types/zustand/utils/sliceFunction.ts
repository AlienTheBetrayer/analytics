// types to help with the zustand's initializer

export type SetType<T> = (partial: (state: T) => T) => void;
export type GetType<T> = () => T;

export type SliceFunction<T> = (set: SetType<T>, get: GetType<T>) => T;

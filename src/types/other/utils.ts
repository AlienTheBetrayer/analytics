/** @format */

export type MapType<T> = T extends Map<unknown, infer T> ? T : never;

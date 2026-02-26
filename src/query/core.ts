/* eslint-disable react-hooks/exhaustive-deps */
import { queryCache, queryListeners } from "@/query/init";
import { QueryConfig } from "@/query/types/config";
import { queryFetch } from "@/query/utils/core";
import {
    CacheAPIValue,
    CacheKey,
    CacheListenerOptions,
} from "@/query/types/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { convertKey } from "@/query/utils/other";

/**
 * performs an optimized, safe, cached query
 * @param config configuration object for the query
 * @returns query's data, error/loading states, meta-data, interaction functions
 */
export const useQuery = <T extends CacheKey>(config: QueryConfig<T>) => {
    // internal states
    const [data, setData] = useState<CacheAPIValue<T>["data"] | null>(
        (queryCache.has({ key: config.key })
            ? queryCache.get({ key: config.key })
            : config.initial) as CacheAPIValue<T>["data"],
    );
    const [isLoading, setIsLoading] = useState<boolean>(
        !queryCache.has({ key: config.key }) &&
            !("trigger" in config && !config.trigger),
    );
    const [error, setError] = useState<Error | null>(null);
    const hasRevalidated = useRef<boolean>(false);

    // hashing
    const hashKey = convertKey(config.key);
    const keyRef = useRef(config.key);

    useEffect(() => {
        keyRef.current = config.key;
    });

    const refetch = useCallback(
        (options: {
            trigger?: boolean;
            keysUndefined?: boolean;
            cache?: boolean;
            ignoreCache?: boolean;
            setLoading?: boolean;
        }) => {
            // trigger
            if (options.trigger && "trigger" in config && !config.trigger) {
                setIsLoading(false);
                return;
            }

            // undefined keys prevention
            if (
                options.keysUndefined &&
                keyRef.current.some((k) => typeof k === "undefined")
            ) {
                setData(null);
                setIsLoading(false);
                return;
            }

            // deduplication
            if (options.cache && queryCache.has({ key: keyRef.current })) {
                setData(
                    queryCache.get({
                        key: keyRef.current,
                    }) as CacheAPIValue<T>["data"],
                );
                setIsLoading(false);
                return;
            }

            // fetch
            if (options.setLoading) {
                setIsLoading(true);
            }
            queryFetch({
                key: keyRef.current,
                ignoreCache: options.ignoreCache,
            })
                .catch((error) => {
                    setError(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [hashKey, config.trigger],
    );

    // initial fetching
    useEffect(() => {
        refetch({
            trigger: true,
            keysUndefined: true,
            cache: true,
            setLoading: true,
        });
    }, [hashKey, config.trigger]);

    // mount revalidating
    useEffect(() => {
        if (hasRevalidated.current || !config.revalidate) {
            return;
        }

        refetch({
            trigger: true,
            keysUndefined: true,
            ignoreCache: true,
        });

        hasRevalidated.current = true;
    }, []);

    const lastHashKey = useRef<string>(hashKey);

    // deps revalidating
    useEffect(() => {
        if (hashKey === lastHashKey.current) {
            return;
        }

        lastHashKey.current = hashKey;

        refetch({
            trigger: true,
            keysUndefined: true,
            ignoreCache: true,
        });
    }, [hashKey]);

    // listeners
    useEffect(() => {
        const attachFn = (options: CacheListenerOptions) => {
            switch (options.type) {
                case "refetch": {
                    if (!options.silent) {
                        setIsLoading(true);
                    }

                    // fetch
                    refetch({
                        keysUndefined: true,
                    });
                    break;
                }
                default: {
                    setData(options.value as CacheAPIValue<T>["data"]);
                    break;
                }
            }
        };

        queryListeners.attach({ key: keyRef.current, fn: attachFn });
        return () =>
            queryListeners.detach({ key: keyRef.current, fn: attachFn });
    }, [hashKey]);

    // returned
    return useMemo(() => {
        return { data, isLoading, error };
    }, [data, isLoading, error]);
};

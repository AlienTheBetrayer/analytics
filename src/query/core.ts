/* eslint-disable react-hooks/exhaustive-deps */
import { queryCache, queryListeners } from "@/query/init";
import { QueryConfig } from "@/query/types/config";
import { queryFetch } from "@/query/utils/core";
import {
    CacheAPIValue,
    CacheKey,
    CacheListenerOptions,
} from "@/query/types/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { convertKey } from "@/query/utils/other";
import { queryInvalidate } from "@/query/auxiliary";

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

    // revalidating
    useEffect(() => {
        if(hasRevalidated.current || !config.revalidate) {
            return;
        }  

        queryInvalidate({ key: keyRef.current });
        hasRevalidated.current = true;
    }, []);

    // initial fetching
    useEffect(() => {
        // trigger
        if ("trigger" in config && !config.trigger) {
            setIsLoading(false);
            return;
        }

        // deduplication
        if (queryCache.has({ key: keyRef.current })) {
            setData(
                queryCache.get({
                    key: keyRef.current,
                }) as CacheAPIValue<T>["data"],
            );
            setIsLoading(false);
            return;
        }

        // undefined keys prevention
        if (keyRef.current.some((k) => typeof k === "undefined")) {
            setData(null);
            setIsLoading(false);
            return;
        }

        // fetch
        setIsLoading(true);
        queryFetch({
            key: keyRef.current,
        })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [hashKey, config.trigger]);

    // listeners
    useEffect(() => {
        const attachFn = (options: CacheListenerOptions) => {
            switch (options.type) {
                case "refetch": {
                    if (!options.silent) {
                        setIsLoading(true);
                    }

                    // fetch
                    queryFetch({
                        key: keyRef.current,
                    })
                        .catch((error) => {
                            setError(error);
                        })
                        .finally(() => {
                            setIsLoading(false);
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

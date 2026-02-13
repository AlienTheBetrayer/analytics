import { MiniSearchData } from "@/features/minisearch/types/data";
import { wrapPromise } from "@/promises/core";
import axios from "axios";
import { useState, useCallback } from "react";

export const useMiniSearch = () => {
    const [data, setData] = useState<MiniSearchData>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // fetching
    const fetch = useCallback(
        async (
            options:
                | {
                      type: "users";
                      query: string;
                  }
                | { type: "friends"; user_id: string },
        ) => {
            return wrapPromise("miniSearch", async () => {
                setIsLoading(true);
                const res = await axios.get("/api/get/search-mini", {
                    params: { ...options },
                });
                setData(res.data?.users);
                setIsLoading(false);
                return res;
            });
        },
        [],
    );

    return {
        data,
        isLoading,
        fetch,
    };
};

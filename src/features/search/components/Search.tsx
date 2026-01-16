"use client";
import { LoadingSearch } from "@/features/loading/components/LoadingSearch";
import { NoResults } from "@/features/search/components/NoResults";
import { Results } from "@/features/search/components/Results";
import { Topline } from "@/features/search/components/Topline";
import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const Search = () => {
    // url
    const { query } = useParams<{ query?: string }>();
    // zustand
    const search = useAppStore((state) => state.search);

    // fetching
    const hasFetched = useRef<boolean>(false);
    const [results, setResults] = useState<Awaited<
        ReturnType<typeof search>
    > | null>(null);

    useEffect(() => {
        if (hasFetched.current || !query) {
            return;
        }

        hasFetched.current = true;
        search({ query }).then((data) => setResults(data));
    }, [query, search]);

    // fallback handling
    // empty query
    if (!query) {
        return (
            <>
                <Topline />
                <div className="box w-full max-w-400">hi</div>
            </>
        );
    }

    // fetching
    if(!results) {
        return (
            <>
                <Topline />
                <LoadingSearch />
            </>
        );
    }

    // empty results
    if (results && !results.length) {
        return (
            <>
                <Topline />
                <NoResults />
            </>
        );
    }

    // main jsx
    return (
        <>
            <Topline />
            {results && <Results data={results} />}
        </>
    );
};

"use client";
import { AbsentTopline } from "@/features/ui/loading/components/AbsentTopline";
import { LoadingSearch } from "@/features/ui/loading/components/LoadingSearch";
import { NoResults } from "@/features/search/components/errors/NoResults";
import { Results } from "@/features/search/components/Results";
import { Topline } from "@/features/search/components/Topline";
import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchResults } from "@/types/zustand/user";

export const Search = () => {
    // url
    const { query } = useParams<{ query?: string }>();
    // zustand
    const search = useAppStore((state) => state.search);

    // fetching
    const hasFetched = useRef<boolean>(false);
    const [results, setResults] = useState<SearchResults | null>(null);

    /**
     * safely fetches with the current query in the url
     */
    const fetchSearch = useCallback(() => {
        if (!query) {
            return;
        }

        search({ query }).then((data) => setResults(data));
    }, [search, query]);

    useEffect(() => {
        if (hasFetched.current || !query) {
            return;
        }

        hasFetched.current = true;
        fetchSearch();
    }, [query, fetchSearch]);

    // fallback handling
    let errorString = "";

    // empty query
    if (!query) {
        errorString = "Query is empty";
    }

    // while fetching
    if (!results) {
        errorString = "Data is absent";
    }

    if (errorString) {
        return (
            <>
                <AbsentTopline title={errorString} />

                <div className="box w-full max-w-400 mx-auto min-h-128">
                    <LoadingSearch />
                </div>
            </>
        );
    }

    // empty results (no вфеф found)
    if (results && !results.posts?.length && !results.users?.length) {
        return (
            <>
                <Topline />

                <div className="box w-full max-w-400 mx-auto min-h-128">
                    <NoResults onSearch={fetchSearch} />
                </div>
            </>
        );
    }

    // users found
    return (
        <>
            <Topline />

            <div className="box w-full max-w-400 mx-auto min-h-128">
                {results && <Results data={results} />}
            </div>
        </>
    );
};

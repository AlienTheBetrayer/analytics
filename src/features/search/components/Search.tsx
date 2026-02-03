"use client";
import { AbsentTopline } from "@/features/ui/loading/components/AbsentTopline";
import { LoadingSearch } from "@/features/ui/loading/components/LoadingSearch";
import { NoResults } from "@/features/search/components/errors/NoResults";
import { Results } from "@/features/search/components/Results";
import { Topline } from "@/features/search/components/Topline";
import { useParams } from "next/navigation";
import { useQuery } from "@/query/core";

export const Search = () => {
    // url
    const { query } = useParams<{ query?: string }>();

    // empty query
    if (!query?.trim().length) {
        return (
            <>
                <AbsentTopline title="Query is empty" />

                <div className="box w-full max-w-400 mx-auto min-h-128">
                    <LoadingSearch />
                </div>
            </>
        );
    }

    return <SearchQuery />;
};

const SearchQuery = () => {
    // url
    const { query } = useParams<{ query: string }>();

    // fetching
    const { data, isLoading } = useQuery({ key: ["search", query, 0] });

    // while fetching
    if (isLoading) {
        return (
            <>
                <AbsentTopline title="Data is absent / Loading..." />

                <div className="box w-full max-w-400 mx-auto min-h-128">
                    <LoadingSearch />
                </div>
            </>
        );
    }

    if (!data?.pages) {
        return (
            <>
                <Topline />

                <div className="box w-full max-w-400 mx-auto min-h-128">
                    <NoResults />
                </div>
            </>
        );
    }

    // results found
    return (
        <>
            <Topline />

            <div className="box w-full max-w-400 mx-auto min-h-128">
                <Results/>
            </div>
        </>
    );
};

import { SearchDisplay } from "@/features/search/components/SearchDisplay";
import { LoadingSearchEntryUser } from "@/features/ui/loading/components/LoadingSearch";
import { useQuery } from "@/query/core";
import { useParams } from "next/navigation";
import React from "react";

type Props = {
    page: number;
};

export const Page = ({ page }: Props) => {
    // url
    const { query } = useParams<{ query: string }>();

    // fetching
    const { data, isLoading } = useQuery({ key: ["search", query, page] });

    // fallbacks
    if (isLoading) {
        return <LoadingSearchEntryUser />;
    }

    if (!data) {
        return null;
    }

    return data.ids.map((id) => (
        <React.Fragment key={id.id}>
            <SearchDisplay data={id} />
            <hr className="mx-auto w-9/12!" />
        </React.Fragment>
    ));
};

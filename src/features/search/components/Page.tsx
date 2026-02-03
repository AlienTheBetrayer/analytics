import { SearchDisplay } from "@/features/search/components/SearchDisplay";
import { LoadingSearchEntryUser } from "@/features/ui/loading/components/LoadingSearch";
import { useQuery } from "@/query/core";
import { useParams } from "next/navigation";

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
        <SearchDisplay
            data={id}
            key={id.id}
        />
    ));
};

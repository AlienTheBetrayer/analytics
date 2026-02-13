import { Results } from "@/features/minisearch/components/Results";
import { SearchUsers } from "@/features/minisearch/components/SearchUsers";
import { useMiniSearch } from "@/features/minisearch/hooks/useMiniSearch";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useEffect, useRef } from "react";

type Props = {
    type: "friends" | "users";
    view: "list" | "select";
    onSelect?: (ids: string[]) => void;
    promiseState?: string;
};

export const MiniSearch = ({ type, view, onSelect, promiseState }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const { data, isLoading, fetch } = useMiniSearch();

    // auto-fetching with friends
    const hasFetched = useRef<boolean>(false);
    useEffect(() => {
        if (hasFetched.current || type !== "friends" || !status) {
            return;
        }

        fetch({ type: "friends", user_id: status.id });
        hasFetched.current = true;
    }, [fetch, type, status]);

    return (
        <div className="acrylic box p-4! gap-2! w-screen max-w-81 min-h-64">
            <span className="flex items-center gap-1 mx-auto">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src={type === "users" ? "/account.svg" : "/friends.svg"}
                />
            </span>

            {type === "users" && (
                <>
                    <SearchUsers
                        onSearch={(query) => {
                            fetch({ type: "users", query });
                        }}
                    />
                    <hr className="my-2!" />
                </>
            )}

            <Results
                search={{ data, isLoading, fetch }}
                type={type}
                view={view}
                onSelect={onSelect}
                promiseState={promiseState}
            />
        </div>
    );
};

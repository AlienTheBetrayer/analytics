import { Page } from "@/features/search/components/Page";
import { Button } from "@/features/ui/button/components/Button";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

export const Results = () => {
    // query
    const { query } = useParams<{ query: string }>();

    // react states
    const [page, setPage] = useState<number>(0);

    // fetching
    const { data, isLoading } = useQuery({ key: ["search", query, page] });

    return (
        <ul className="flex flex-col gap-4">
            <li className="flex flex-col items-center gap-1 self-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cube.svg"
                />

                <div className="flex items-center gap-2">
                    <span>Results: {data?.pages}</span>
                </div>
            </li>

            <li>
                <hr />
            </li>

            <li>
                <ul className="flex flex-col gap-8">
                    {Array.from({ length: page + 1 }, (_, k) => (
                        <Page
                            page={k}
                            key={k}
                        />
                    ))}
                </ul>
            </li>

            {(page + 1) * 3 < (data?.pages ?? 0) && (
                <li>
                    <Button
                        className="w-full"
                        onClick={() => {
                            setPage((prev) => prev + 1);
                        }}
                    >
                        {isLoading && <Spinner />}
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/server.svg"
                        />
                        Load more
                    </Button>
                </li>
            )}
        </ul>
    );
};

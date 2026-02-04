import { Page } from "@/features/search/components/Page";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Select } from "@/features/ui/select/components/Select";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

const WhatSelect = ["All pages", "Last page", "First page"] as const;

export const Results = () => {
    // query
    const { query } = useParams<{ query: string }>();

    // react states
    const [page, setPage] = useState<number>(0);
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [whatReload, setWhatReload] =
        useState<(typeof WhatSelect)[number]>("First page");

    // fetching
    const { data, isLoading } = useQuery({ key: ["search", query, page] });

    return (
        <ul className="flex flex-col gap-8">
            <li className="box flex-row! h-10! p-0! mt-8! md:mt-0! w-full gap-2! items-center">
                <Tooltip text="Collapse / Expand">
                    <Button onClick={() => setCollapsed((prev) => !prev)}>
                        <Image
                            alt=""
                            width={20}
                            height={20}
                            src="/collapse.svg"
                        />
                        <TabSelection
                            condition={true}
                            color={
                                collapsed ? "var(--orange-1)" : "var(--blue-1)"
                            }
                        />
                    </Button>
                </Tooltip>

                <Input
                    container={{ style: { width: "fit-content" } }}
                    placeholder="Filter by username"
                    value={filter}
                    onChange={(value) => setFilter(value)}
                />

                <div className="flex items-center gap-1! absolute left-1/2 -top-1/2 md:top-1/2 -translate-1/2">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/arrow.svg"
                    />

                    <span>
                        Results: <mark>{data?.pages}</mark>
                    </span>
                </div>

                <Select
                    items={[...WhatSelect]}
                    className="ml-auto! w-full! max-w-32! whitespace-nowrap!"
                    value={whatReload}
                    onChange={(item) =>
                        setWhatReload(item as (typeof WhatSelect)[number])
                    }
                />
                <Tooltip text="Re-fetch">
                    <Button
                        onClick={() => {
                            const pages = (() => {
                                switch (whatReload) {
                                    case "All pages": {
                                        return Array.from(
                                            { length: page + 1 },
                                            (_, k) => k,
                                        );
                                    }
                                    case "First page": {
                                        return [0];
                                    }
                                    case "Last page": {
                                        return [page];
                                    }
                                }
                            })();

                            for (const page of pages) {
                                queryInvalidate({
                                    key: ["search", query, page],
                                    silent: false,
                                });
                            }
                        }}
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/reload.svg"
                        />
                    </Button>
                </Tooltip>
            </li>

            <li>
                <hr />
            </li>

            <li
                className="overflow-hidden transition-all duration-500"
                style={{
                    interpolateSize: "allow-keywords",
                    height: collapsed ? "0" : "auto",
                }}
            >
                <ul className="flex flex-col gap-8">
                    {Array.from({ length: page + 1 }, (_, k) => (
                        <Page
                            filter={filter}
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

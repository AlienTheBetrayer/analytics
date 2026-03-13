import { CountAllTablesEntries } from "@/app/api/get/count-all-tables/route";
import { BentoSection } from "@/features/bentogrid/components/parts/BentoSection";
import { InfoTooltip } from "@/features/bentogrid/components/parts/InfoTooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { queryDelete, queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useState } from "react";

// data
const UseQueryImages = new Map<(typeof CountAllTablesEntries)[number], { src: string; tooltip: string }>([
    ["conversations", { src: "/comments.svg", tooltip: "Comments" }],
    ["events", { src: "/type.svg", tooltip: "Dashboard's events" }],
    ["projects", { src: "/link.svg", tooltip: "Dashboard's projects" }],
    ["tokens", { src: "/security.svg", tooltip: "JWT Tokens" }],
    ["noteboard_elements", { src: "/description.svg", tooltip: "Noteboard's elements" }],
    ["noteboards", { src: "/dashboard.svg", tooltip: "Noteboards" }],
    ["contact_messages", { src: "/commentadd.svg", tooltip: "Contact messages" }],
    ["invitations", { src: "/back.svg", tooltip: "Invitations" }],
    ["colors", { src: "/cubes.svg", tooltip: "Colors" }],
    ["messages", { src: "/comments.svg", tooltip: "Messages" }],
    ["posts", { src: "/select.svg", tooltip: "Posts" }],
    ["users", { src: "/account.svg", tooltip: "Users" }],
]);

export const UseQuery = () => {
    // fetching
    const [fetch, setFetch] = useState<boolean>(false);
    const { data, isLoading } = useQuery({ key: ["countAllTables"], trigger: fetch });

    return (
        <BentoSection
            src="/auth.svg"
            text="useQuery()"
        >
            <ul className="grid! grid-cols-2 gap-2 w-full max-w-48 mx-auto!">
                <li>
                    <InfoTooltip
                        color="var(--blue-1)"
                        src="/archive.svg"
                        text={"Revamp"}
                    >
                        A custom data-fetching system inspired by TanStack Query with strong type enforcement
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--blue-1)"
                        src="/server.svg"
                        text={"Caching"}
                    >
                        All data is key-cached and accessed in O(1) time, automatically propagated to JSX
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--red-3)"
                        src="/link.svg"
                        text={"SWR"}
                    >
                        The SWR pattern is implemented to display cached data while revalidating in the background
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--green-1)"
                        src="/arrow.svg"
                        text={"Promises"}
                    >
                        Automatic promise deduplication and race condition handling ensure efficient data fetching
                    </InfoTooltip>
                </li>
            </ul>

            <ul className="flex items-center gap-1 mx-auto! mt-6!">
                <li>
                    <Button
                        className="px-3!"
                        onClick={() => {
                            setFetch(true);

                            if (fetch) {
                                queryInvalidate({ key: ["countAllTables"], silent: false });
                            }
                        }}
                    >
                        <div
                            className="w-1 h-1 rounded-full transition-all duration-500"
                            style={{ background: data ? "var(--orange-1)" : "var(--blue-1)" }}
                        />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src={data ? "/reload.svg" : "/server.svg"}
                        />
                        Fetch
                    </Button>
                </li>

                <li
                    className="overflow-hidden transition-all duration-500! ease-in-out"
                    style={{ maxWidth: data ? "2.25rem" : "0rem" }}
                >
                    <Button
                        inert={!data}
                        onClick={() => {
                            queryDelete({ key: ["countAllTables"] });
                        }}
                        className="gap-0!"
                    >
                        <div className="w-1 h-1 rounded-full bg-red-1 shrink-0" />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/delete.svg"
                        />
                    </Button>
                </li>
            </ul>

            <div className="flex flex-col w-full max-w-56 mx-auto! h-42">
                {isLoading ?
                    <div className="flex items-center justify-center grow loading  rounded-4xl!">
                        <Spinner />
                    </div>
                : !data ?
                    <div className="box flex gap-0! p-0! items-center justify-center grow loading rounded-4xl!">
                        <span className="flex items-center">
                            <div className="w-1 h-1 rounded-full bg-red-1" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/cross.svg"
                            />
                            <span>Data is absent</span>
                        </span>
                        <span>
                            <small>Upon fetch data is retrieved</small>
                        </span>
                    </div>
                :   <ul className="box gap-1! p-2! grow bg-bg-2! flex-row! flex-wrap">
                        {data.map((entry) => {
                            const element = UseQueryImages.get(entry.table);
                            const src = element?.src ?? "/cube.svg";
                            const tooltip = element?.tooltip ?? "Table";

                            return (
                                <li
                                    key={entry.table}
                                    className="box p-0! gap-0! w-12! h-12!"
                                >
                                    <Tooltip
                                        className="w-full h-full flex flex-col items-center justify-center"
                                        direction="top"
                                        text={tooltip}
                                    >
                                        <span className="flex items-center">
                                            <div className="w-1 h-1 rounded-full bg-blue-4" />
                                            <Image
                                                alt=""
                                                width={16}
                                                height={16}
                                                src={src}
                                            />
                                        </span>

                                        <span className="text-7!">{entry.count}</span>
                                    </Tooltip>
                                </li>
                            );
                        })}
                    </ul>
                }
            </div>
        </BentoSection>
    );
};

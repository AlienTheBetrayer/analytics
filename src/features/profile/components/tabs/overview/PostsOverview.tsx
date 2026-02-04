import { PostCompact } from "@/features/posts/components/parts/compact/PostCompact";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryCache } from "@/query/init";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useState } from "react";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
    collapsed: [
        "profile" | "posts" | null,
        React.Dispatch<React.SetStateAction<"profile" | "posts" | null>>,
    ];
};

export const PostsOverview = ({
    data,
    collapsed: [collapsed, setCollapsed],
}: Props) => {
    const [filter, setFilter] = useState<string>("");

    return (
        <div className="flex flex-col gap-4">
            <ul className="box p-0! h-10! rounded-full! flex-row! items-center">
                <li>
                    <Tooltip text="Collapse / Expand">
                        <Button
                            className="p-0!"
                            onClick={() =>
                                setCollapsed((prev) =>
                                    prev === "posts" ? null : "posts",
                                )
                            }
                        >
                            <Image
                                alt=""
                                width={20}
                                height={20}
                                src="/collapse.svg"
                            />
                            <TabSelection
                                condition={true}
                                color={
                                    collapsed === "posts"
                                        ? "var(--orange-1)"
                                        : "var(--blue-1)"
                                }
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li>
                    <Input
                        isEnabled={!!data.post_ids.length}
                        placeholder="Filter by title"
                        value={filter}
                        onChange={(value) => setFilter(value)}
                    />
                </li>

                <li className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/select.svg"
                    />
                    <span>Posts:</span>
                </li>

                <li className="ml-auto!">
                    <Tooltip text="Go to posts">
                        <LinkButton href={`/posts/${data.username}`}>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/launch.svg"
                            />
                        </LinkButton>
                    </Tooltip>
                </li>
            </ul>

            <div
                className="overflow-hidden transition-all duration-500"
                style={{
                    interpolateSize: "allow-keywords",
                    height: collapsed === "posts" ? "0rem" : "auto",
                }}
            >
                <ul className="flex flex-col gap-4 w-full justify-center relative">
                    {Array.from({ length: 3 }, (_, k) => (
                        <li
                            key={k}
                            className="w-full h-48"
                        >
                            <PostsOverviewElement
                                k={k}
                                post_ids={data.post_ids}
                                filter={filter}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

type ListProps = {
    k: number;
    filter: string;
    post_ids: string[];
};
const PostsOverviewElement = ({ k, filter, post_ids }: ListProps) => {
    if (!post_ids[k]) {
        return <PostElementNotFound type="absent" />;
    }

    if (
        filter &&
        !(
            queryCache.get({
                key: ["post", post_ids[k]],
            }) as CacheAPIProtocol["post"]["data"]
        )?.title?.includes(filter)
    ) {
        return <PostElementNotFound type="filter" />;
    }

    return (
        <PostCompact
            id={post_ids[k]}
            className="h-48!"
        />
    );
};

type NotFoundProps = {
    className?: string;
    type: "absent" | "filter";
};
export const PostElementNotFound = ({ className, type }: NotFoundProps) => {
    return (
        <Tooltip
            text="Does not exist"
            className="w-full h-full"
        >
            <div
                className={`box p-2! rounded-4xl! loading h-full ${className ?? ""} ${type === "absent" ? "opacity-30" : ""}`}
            >
                <span className="flex gap-1 items-center whitespace-nowrap absolute left-1/2 top-1/2 -translate-1/2 ">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src={type === "absent" ? "/delete.svg" : "/filter.svg"}
                    />
                    <span>
                        {type === "absent" ? (
                            <>
                                Post does <u>not</u> exist
                            </>
                        ) : (
                            <>
                                <u>Filtered</u>
                            </>
                        )}
                    </span>
                </span>
            </div>
        </Tooltip>
    );
};

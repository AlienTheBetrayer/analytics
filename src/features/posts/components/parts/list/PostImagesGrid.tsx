import { PostGridElement } from "@/features/posts/components/parts/list/PostGridElement";
import { PostElementNotFound } from "@/features/profile/components/tabs/overview/PostsOverview";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { queryCache } from "@/query/init";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";

const randomRedirect = (posts: string[] | null) => {
    if (!posts) {
        return;
    }

    const ids = [...posts];
    const id = ids.at(Math.round(Math.random() * ids.length - 1));

    if (!id) {
        return;
    }

    redirect(`/post/view/${id}`);
};

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const PostImagesGrid = ({ data }: Props) => {
    // fetching
    const { data: posts } = useQuery({ key: ["posts", data.id] });

    // 4 most recent posts
    const recentIds: (string | null)[] = [
        ...(posts?.slice(0, 4) ?? []),
        ...Array(4).fill(null),
    ].slice(0, 4);

    // react states
    const [filter, setFilter] = useState<string>("");

    return (
        <article className="flex flex-col gap-4">
            <ul className="flex bg-bg-2! flex-row! h-10! items-center gap-1 box p-0! w-full">
                <li>
                    <Tooltip text="Go to a random post">
                        <Button
                            onClick={() => {
                                randomRedirect(posts);
                            }}
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/random.svg"
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li>
                    <Input
                        value={filter}
                        onChange={(value) => setFilter(value)}
                        placeholder="Filter by title"
                    />
                </li>

                <li className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/notification.svg"
                    />
                    <span>
                        <mark>Relevant</mark> posts:
                    </span>
                </li>
            </ul>

            <hr className="w-full max-w-lg self-center" />

            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-auto grow items-center">
                {recentIds.map((id, k) => (
                    <li
                        className="aspect-square"
                        key={id ?? k}
                    >
                        <PostImagesGridElement
                            id={id}
                            filter={filter}
                        />
                    </li>
                ))}
            </ul>

            <hr className="w-full max-w-lg self-center" />

            <Tooltip
                text={`Go to a random post`}
                className="w-full sm:max-w-64 self-center"
                isEnabled={!!posts?.length}
            >
                <Button
                    className="w-full"
                    onClick={() => {
                        randomRedirect(posts);
                    }}
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/random.svg"
                    />
                    Random
                </Button>
            </Tooltip>
        </article>
    );
};

type ElementProps = {
    id: string | null;
    filter: string;
};
const PostImagesGridElement = ({ id, filter }: ElementProps) => {
    if (!id) {
        return <PostElementNotFound type="absent" />;
    }

    if (
        filter &&
        !(
            queryCache.get({
                key: ["post", id],
            }) as CacheAPIProtocol["post"]["data"]
        )?.title?.includes(filter)
    ) {
        return <PostElementNotFound type="filter" />;
    }

    return <PostGridElement id={id} />;
};

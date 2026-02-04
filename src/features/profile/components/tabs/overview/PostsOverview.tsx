import { PostCompact } from "@/features/posts/components/parts/compact/PostCompact";
import { NoPosts } from "@/features/profile/components/errors/NoPosts";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { CacheAPIProtocol } from "@/query-api/protocol";
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
    const [postInput, setPostInput] = useState<string>("");

    return (
        <div className="flex flex-col gap-4">
            <ul className="box p-0! h-10! rounded-full! flex-row! items-center">
                <li>
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
                </li>

                <li>
                    <Input
                        isEnabled={!!data.post_ids.length}
                        placeholder="Filter by title"
                        value={postInput}
                        onChange={(value) => setPostInput(value)}
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
            </ul>

            <div
                className="overflow-hidden transition-all duration-500"
                style={{
                    interpolateSize: "allow-keywords",
                    height: collapsed === "posts" ? "0rem" : "auto",
                }}
            >
                <ul className="flex flex-col gap-4 w-full justify-center relative">
                    {data.post_ids?.length ? (
                        data.post_ids.map((id) => (
                            <li key={id}>
                                <PostCompact
                                    filter={postInput}
                                    id={id}
                                    className="h-48!"
                                />
                            </li>
                        ))
                    ) : (
                        <>
                            {Array.from({ length: 3 }, (_, k) => (
                                <li key={k}>
                                    <div className="w-full h-48 rounded-4xl loading" />
                                </li>
                            ))}

                            <li className="absolute left-1/2 top-1/2 -translate-1/2">
                                <NoPosts />
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

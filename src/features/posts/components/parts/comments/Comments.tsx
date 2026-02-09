import { CommentList } from "@/features/posts/components/parts/comments/CommentList";
import { UpdateComment } from "@/features/posts/components/parts/comments/UpdateComment";
import { NoComments } from "@/features/posts/components/parts/errors/NoComments";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useState } from "react";

type Props = {
    id: string;
};

export const Comments = ({ id }: Props) => {
    // fetching
    const { data: post } = useQuery({ key: ["post", id] });
    const { data: comments, isLoading } = useQuery({ key: ["comments", id] });
    const { data: privacy } = useQuery({ key: ["post_privacy", id] });
    const { data: status } = useQuery({ key: ["status"] });

    const areCommentsEditable =
        status && (privacy?.comments !== false || status.id === post?.user_id);

    // react states
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");

    return (
        <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-1! box bg-bg-2! p-0! flex-row! h-10!">
                <Tooltip text="Collapse / Expand">
                    <Button
                        onClick={() => setCollapsed((prev) => !prev)}
                        className="p-0!"
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
                                collapsed ? "var(--orange-1)" : "var(--blue-1)"
                            }
                        />
                    </Button>
                </Tooltip>

                <hr className="w-px! h-1/2!" />

                <Input
                    container={{ style: { width: "fit-content" } }}
                    isEnabled={!!comments?.length}
                    placeholder="Filter by comment"
                    value={filter}
                    onChange={(value) => setFilter(value)}
                />

                <div className="flex items-center gap-1 absolute left-1/2 -top-1/2 md:top-1/2 -translate-1/2">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/comments.svg"
                    />
                    <span>Comments:</span>
                </div>

                <Tooltip
                    text="Reload comments"
                    className="ml-auto!"
                >
                    <Button
                        onClick={() => {
                            wrapPromise("reloadComments", async () => {
                                return queryInvalidate({
                                    key: ["comments", post?.id],
                                    silent: false,
                                });
                            });
                        }}
                    >
                        <PromiseState state="reloadComments" />
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
                <ul className="flex flex-col gap-4 relative">
                    <li>
                        {post && (
                            <UpdateComment
                                isEnabled={!!areCommentsEditable}
                                type="send"
                                data={{ post }}
                            />
                        )}
                    </li>

                    <li>
                        <hr />
                    </li>
                </ul>
            </li>

            <li
                className="duration-500 transition-all overflow-hidden"
                style={{
                    interpolateSize: "allow-keywords",
                    height: collapsed ? "0" : "auto",
                }}
            >
                <CommentsDisplay
                    isLoading={isLoading}
                    comments={comments}
                    filter={filter}
                />
            </li>
        </ul>
    );
};

type DisplayProps = {
    isLoading: boolean;
    comments: string[] | null;
    filter?: string;
};
const CommentsDisplay = ({ isLoading, comments, filter }: DisplayProps) => {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }, (_, k) => (
                    <div
                        className="w-full h-36 loading"
                        key={k}
                    />
                ))}
            </div>
        );
    }

    if (!comments?.length) {
        return (
            <div className="w-full h-36 loading flex justify-center items-center">
                <NoComments />
            </div>
        );
    }

    return (
        <CommentList
            comments={comments}
            filter={filter}
        />
    );
};

import { CommentList } from "@/features/posts/components/parts/comments/CommentList";
import { UpdateComment } from "@/features/posts/components/parts/comments/UpdateComment";
import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import Image from "next/image";

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
        privacy?.comments !== false || status?.id === post?.user_id;

    return (
        <ul className="flex flex-col gap-8">
            {status && (
                <div
                    className="flex flex-col gap-8 relative"
                    style={{
                        opacity: areCommentsEditable ? 1 : 0.3,
                    }}
                    inert={!areCommentsEditable}
                >
                    {!areCommentsEditable && (
                        <Image
                            alt="prohibited"
                            src="/prohibited.svg"
                            width={32}
                            height={32}
                            className="z-1 absolute left-1/2 top-1/2 -translate-1/2"
                        />
                    )}

                    <li className="flex justify-center items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/plus.svg"
                        />
                        <span>Add a comment:</span>
                    </li>

                    <li>
                        {post && (
                            <UpdateComment
                                type="send"
                                data={{ post }}
                            />
                        )}
                    </li>

                    <li>
                        <hr />
                    </li>
                </div>
            )}

            <li className="flex justify-center items-center gap-1">
                <Tooltip text="Reload comments">
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
                            src="/comments.svg"
                        />
                    </Button>
                </Tooltip>
                <span>Comments:</span>
            </li>

            <li>
                <CommentsDisplay
                    isLoading={isLoading}
                    comments={comments}
                />
            </li>
        </ul>
    );
};

type DisplayProps = {
    isLoading: boolean;
    comments: string[] | null;
};
const CommentsDisplay = ({ isLoading, comments }: DisplayProps) => {
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
            <span className="mx-auto!">
                <small>
                    <u>No</u> comments yet...
                </small>
            </span>
        );
    }

    return <CommentList comments={comments} />;
};

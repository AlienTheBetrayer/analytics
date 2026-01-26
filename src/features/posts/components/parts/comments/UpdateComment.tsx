import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { Comment, Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useState } from "react";

type Props =
    | { type: "send"; data: { post: Post } }
    | { type: "edit"; data: { comment: Comment; onEdit?: (comment: string) => void } };

export const UpdateComment = ({ type, data }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const status = useAppStore((state) => state.status);
    const updateComment = useAppStore((state) => state.updateComment);

    // react
    const [comment, setComment] = useState<string>(
        type === "edit" ? data.comment.comment : "",
    );

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();

                if (!status || comment.trim().length < 8) {
                    return;
                }

                if (type === "send") {
                    updateComment({
                        type: "send",
                        comment,
                        user_id: status.id,
                        post_id: data.post.id,
                    });
                } else {
                    updateComment({
                        type: "edit",
                        comment,
                        user_id: status.id,
                        comment_id: data.comment.id,
                    });
                    data.onEdit?.(comment);
                }
            }}
        >
            <ul className="flex flex-col gap-4">
                <li className="flex flex-col sm:flex-row gap-2 items-center">
                    <Input
                        aria-label="comment text"
                        required
                        minLength={8}
                        maxLength={256}
                        placeholder="at least 8 characters"
                        value={comment}
                        onChange={setComment}
                    />

                    <div className="grid grid-cols-2 w-full sm:w-fit gap-2">
                        <Tooltip
                            text="Clear comment"
                            className="w-full"
                        >
                            <Button
                                aria-label="clear"
                                className="w-full"
                                type="button"
                                onClick={() => {
                                    setComment("");
                                }}
                            >
                                <Image
                                    alt="x"
                                    width={16}
                                    height={16}
                                    src="/delete.svg"
                                />
                            </Button>
                        </Tooltip>

                        <Tooltip
                            text={`${type === "edit" ? "Edit" : "Send"}`}
                            className="w-full"
                        >
                            <Button
                                aria-label="send"
                                className="w-full"
                                type="submit"
                            >
                                <PromiseStatus
                                    status={promises.updateComment}
                                />
                                <Image
                                    alt="x"
                                    width={16}
                                    height={16}
                                    src="/send.svg"
                                />
                            </Button>
                        </Tooltip>
                    </div>
                </li>
            </ul>
        </form>
    );
};

import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { updateComment } from "@/query-api/calls/posts";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { Post } from "@/types/tables/posts";
import Image from "next/image";
import { useState } from "react";

type Props =
    | { type: "send"; data: { post: Post } }
    | {
          type: "edit";
          data: {
              comment: CacheAPIProtocol["comment"]["data"];
              onEdit?: (comment: string) => void;
          };
      };

export const UpdateComment = ({ type, data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    // react
    const [comment, setComment] = useState<string>(
        type === "edit" ? data.comment.comment : "",
    );

    if (!status) {
        return null;
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();

                if (!status || comment.trim().length < 8) {
                    return;
                }

                wrapPromise("updateComment", () => {
                    if (type === "send") {
                        return updateComment({
                            type: "send",
                            comment,
                            user_id: status.id,
                            post_id: data.post.id,
                        });
                    } else {
                        data.onEdit?.(comment);
                        return updateComment({
                            type: "edit",
                            comment,
                            user_id: status.id,
                            comment_id: data.comment.id,
                            post_id: data.comment.post_id,
                        });
                    }
                });
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
                                <PromiseState state="updateComment" />
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

import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useState } from "react";

type Props = {
    data: Post;
};

export const SendComment = ({ data }: Props) => {
    // zustand
    const comments = useAppStore((state) => state.comments);
    const promises = useAppStore((state) => state.promises);
    const status = useAppStore((state) => state.status);
    const updateComment = useAppStore((state) => state.updateComment);

    const [comment, setComment] = useState<string>("");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (!status) {
                    return;
                }

                updateComment({
                    type: "send",
                    comment,
                    user_id: status.id,
                    post_id: data.id,
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
                            text="Cancel this comment"
                            className="w-full"
                        >
                            <Button
                                aria-label="cancel"
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
                            text="Send"
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

                <li className="flex flex-col gap-2 items-center">
                    <hr />
                </li>

                <li className="flex flex-col gap-2 items-center"></li>
            </ul>
        </form>
    );
};

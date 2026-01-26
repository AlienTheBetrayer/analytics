import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { CloseButton } from "@/features/ui/closebutton/components/CloseButton";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { Post } from "@/types/tables/posts";
import { relativeTime } from "@/utils/other/relativeTime";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useState } from "react";

type Props = {
    data: Post;
    hide?: () => void;
};

export const Configurations = ({ data, hide }: Props) => {
    // zustand
    const postPrivacy = useAppStore((state) => state.postPrivacy);
    const promises = useAppStore((state) => state.promises);
    const status = useAppStore((state) => state.status);
    const updatePost = useAppStore((state) => state.updatePost);

    const thisPrivacy = postPrivacy[data.id] ? postPrivacy[data.id] : undefined;

    // react state
    const [comments, setComments] = useState<boolean>(
        thisPrivacy?.comments ?? true,
    );
    const [likes, setLikes] = useState<boolean>(thisPrivacy?.likes ?? true);

    return (
        <div className="box w-screen max-w-91">
            <CloseButton hide={() => hide?.()} />

            <div className="flex flex-col items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/settings.svg"
                />
                <span>Privacy configurations</span>
                {thisPrivacy?.edited_at && (
                    <span>
                        <small>
                            edited {relativeTime(thisPrivacy.edited_at)}
                        </small>
                    </span>
                )}
            </div>

            <hr />

            <form
                className="flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!status) {
                        return;
                    }

                    updatePost({
                        type: "privacy",
                        id: data.id,
                        user_id: status.id,
                        privacy: { comments, likes },
                        promiseKey: "updatePostPrivacy",
                    });
                }}
            >
                <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/security.svg"
                        />
                        <span>Others able to:</span>
                    </li>

                    <li className="flex flex-col gap-2 items-center">
                        <Checkbox
                            value={comments}
                            onToggle={(flag) => setComments(flag)}
                        >
                            Comment
                        </Checkbox>
                    </li>

                    <li className="flex flex-col gap-2 items-center">
                        <Checkbox
                            value={likes}
                            onToggle={(flag) => setLikes(flag)}
                        >
                            Like
                        </Checkbox>
                    </li>

                    <li>
                        <hr />
                    </li>

                    <li className="flex flex-col gap-2 items-center">
                        <Button
                            className="w-full"
                            type="submit"
                        >
                            <PromiseStatus
                                status={promises.updatePostPrivacy}
                            />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/send.svg"
                            />
                            Apply changes
                        </Button>
                    </li>
                </ul>
            </form>
        </div>
    );
};

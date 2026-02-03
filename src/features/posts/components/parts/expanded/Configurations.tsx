import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { CloseButton } from "@/features/ui/closebutton/components/CloseButton";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { updatePost } from "@/query-api/calls/posts";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";
import { useState } from "react";

type Props = {
    data: CacheAPIProtocol["post"]["data"];
    hide?: () => void;
};

export const Configurations = ({ data, hide }: Props) => {
    // zustand
    const { data: post_privacy } = useQuery({ key: ["post_privacy", data.id] });
    const { data: status } = useQuery({ key: ["status"] });

    // react state
    const [comments, setComments] = useState<boolean>(
        post_privacy?.comments ?? true,
    );
    const [likes, setLikes] = useState<boolean>(post_privacy?.likes ?? true);

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
                {post_privacy?.edited_at && (
                    <span>
                        <small>
                            edited {relativeTime(post_privacy.edited_at)}
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

                    wrapPromise("updatePrivacy", () => {
                        return updatePost({
                            type: "privacy",
                            id: data.id,
                            user_id: status.id,
                            privacy: { comments, likes },
                        });
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
                            <PromiseState state="updatePrivacy" />
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

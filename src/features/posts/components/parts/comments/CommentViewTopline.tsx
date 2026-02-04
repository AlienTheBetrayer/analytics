import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { updateComment } from "@/query-api/calls/posts";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["comment"]["data"];
    onEdit: () => void;
};

export const CommentViewTopline = ({ data, onEdit }: Props) => {
    // fetching
    const { data: user } = useQuery({ key: ["user", data.user_id] });
    const { data: status } = useQuery({ key: ["status"] });

    // box
    const deleteBox = useMessageBox();

    return (
        <ul className="flex gap-2">
            {deleteBox.render({
                children:
                    "Your comment will be gone and no one will be able to see it.",
                onSelect: (res) => {
                    if (!status) {
                        return;
                    }

                    if (res === "yes") {
                        wrapPromise(`deleteComment_${data.id}`, () => {
                            return updateComment({
                                type: "delete",
                                user_id: status.id,
                                comment_id: data.id,
                                post_id: data.post_id,
                            });
                        });
                    }
                },
            })}

            <li>
                <ul className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <li className="flex items-center">
                        <LinkButton
                            styles="link"
                            href={`/profile/${user?.username}`}
                            className="p-0! w-fit! h-fit!"
                        >
                            <span>
                                <mark>{user?.username}</mark>
                            </span>
                        </LinkButton>
                    </li>

                    <li className="hidden sm:flex items-center self-stretch">
                        <hr className="w-px! h-2/3! self-center" />
                    </li>

                    <li className="flex items-center">
                        <span className="flex items-center gap-0.5">
                            <small>
                                <Image
                                    alt=""
                                    width={12}
                                    height={12}
                                    src="/plus.svg"
                                />
                            </small>
                            <small>{relativeTime(data.created_at)}</small>
                        </span>
                    </li>
                </ul>
            </li>

            <li className="ml-auto!">
                <ul className="flex flex-col sm:flex-row gap-2 items-end sm:items-start">
                    {data.edited_at && (
                        <li className="flex items-center">
                            <span className="flex items-center gap-0.5">
                                <small>
                                    <Image
                                        alt=""
                                        width={13}
                                        height={13}
                                        src="/pencil.svg"
                                    />
                                </small>
                                <small>{relativeTime(data.edited_at)}</small>
                            </span>
                        </li>
                    )}

                    {status?.id === data.user_id && (
                        <li>
                            <ul className="flex items-center gap-1">
                                <li>
                                    <Tooltip text="Edit your comment">
                                        <Button onClick={onEdit}>
                                            <Image
                                                alt=""
                                                width={16}
                                                height={16}
                                                src="/pencil.svg"
                                            />
                                        </Button>
                                    </Tooltip>
                                </li>

                                <li>
                                    <Tooltip text="Delete your comment">
                                        <Button onClick={deleteBox.show}>
                                            <PromiseState
                                                state={`deleteComment_${data.id}`}
                                            />
                                            <Image
                                                alt=""
                                                width={16}
                                                height={16}
                                                src="/delete.svg"
                                            />
                                        </Button>
                                    </Tooltip>
                                </li>
                            </ul>
                        </li>
                    )}
                </ul>
            </li>
        </ul>
    );
};

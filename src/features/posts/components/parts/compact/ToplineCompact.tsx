import { Configurations } from "@/features/posts/components/parts/expanded/Configurations";
import { TinyTooltip } from "@/features/posts/components/parts/TinyTooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    data: Post;
    type: "compact" | "expanded";
    className?: string;
    onDelete?: () => void;
};

export const ToplineCompact = ({ data, className, type, onDelete }: Props) => {
    // zustand
    const postIds = useAppStore((state) => state.postIds);
    const postPrivacy = useAppStore((state) => state.postPrivacy);
    const postLikeIds = useAppStore((state) => state.postLikeIds);
    const postLikes = useAppStore((state) => state.postLikes);
    const status = useAppStore((state) => state.status);
    const like = useAppStore((state) => state.like);

    const isLikeAvailable =
        postPrivacy[data.id]?.likes !== false || status?.id === data.user_id;
    const hasLiked =
        (status && postLikeIds[status.username]?.has(data.id)) ?? false;

    return (
        <ul
            className={`box flex-row! gap-1! px-2! py-0! items-center! w-full h-10! bg-[#00000030]!
                ${data.image_url ? "border-0!" : ""}
                ${className ?? ""}`}
        >
            <li className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2 whitespace-nowrap">
                <div
                    className="w-1 h-1 rounded-full aspect-square"
                    style={{
                        background: data.image_url
                            ? "var(--blue-1)"
                            : data.content
                              ? "var(--orange-1)"
                              : "var(--red-1)",
                    }}
                />
                <span>
                    <em>{data.title}</em>
                </span>
            </li>

            <TinyTooltip
                data={data.edited_at}
                src="/pencil.svg"
                tooltip="This post has been edited"
            />

            <TinyTooltip
                data={postPrivacy[data.id]?.edited_at}
                src="/security.svg"
                tooltip="Privacy configured"
                size={14}
            />

            <TinyTooltip
                data={postLikes[data.id]}
                showData
                src="/heart.svg"
                size={10}
                tooltip="Total amount of likes"
            />

            <ul className="flex items-center gap-1 ml-auto!">
                {status && (
                    <li>
                        <Tooltip
                            text={`${hasLiked ? "Remove like" : "Like this post"}`}
                            isEnabled={isLikeAvailable}
                        >
                            <Button
                                aria-label={`${hasLiked ? "unlike post" : "like post"}`}
                                onClick={() => {
                                    if (!status) {
                                        return;
                                    }

                                    like({
                                        what: "post",
                                        type: "like",
                                        id: data.id,
                                        user_id: status.id,
                                        promiseKey: `likePost_${data.id}`,
                                    });
                                }}
                                className={`${hasLiked ? "invert-100!" : ""}`}
                            >
                                {!isLikeAvailable ? (
                                    <Image
                                        alt="prohibited"
                                        src="/prohibited.svg"
                                        width={16}
                                        height={16}
                                        className="z-2 absolute left-1/2 top-1/2 -translate-1/2"
                                    />
                                ) : hasLiked ? (
                                    <Image
                                        alt=""
                                        width={15}
                                        height={15}
                                        src="/heartbroken.svg"
                                    />
                                ) : (
                                    <Image
                                        alt=""
                                        width={14}
                                        height={14}
                                        src="/heart.svg"
                                    />
                                )}
                            </Button>
                        </Tooltip>
                    </li>
                )}

                {type === "compact" ? (
                    <>
                        <li>
                            <Tooltip text="View this post">
                                <LinkButton
                                    href={`/post/view/${data.id}`}
                                    ariaLabel="view post"
                                >
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/launch.svg"
                                    />
                                </LinkButton>
                            </Tooltip>
                        </li>
                    </>
                ) : (
                    status &&
                    status.id === data.user_id && (
                        <>
                            <li>
                                <Tooltip text="Delete this post">
                                    <Button
                                        onClick={onDelete}
                                        aria-label="delete post"
                                    >
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/delete.svg"
                                        />
                                    </Button>
                                </Tooltip>
                            </li>

                            <li>
                                <Tooltip text="Privacy configurations">
                                    <Modal
                                        element={(hide) => (
                                            <Configurations
                                                data={data}
                                                hide={hide}
                                            />
                                        )}
                                    >
                                        <Button aria-label="privacy">
                                            <Image
                                                alt=""
                                                width={16}
                                                height={16}
                                                src="/security.svg"
                                            />
                                        </Button>
                                    </Modal>
                                </Tooltip>
                            </li>
                        </>
                    )
                )}

                {status && postIds[status.username]?.has(data.id) && (
                    <li>
                        <Tooltip text="Edit this post">
                            <LinkButton
                                href={`/post/edit/${data.id}`}
                                ariaLabel="edit post"
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/pencil.svg"
                                />
                            </LinkButton>
                        </Tooltip>
                    </li>
                )}
            </ul>
        </ul>
    );
};

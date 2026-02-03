import { Configurations } from "@/features/posts/components/parts/expanded/Configurations";
import { TinyTooltip } from "@/features/posts/components/parts/TinyTooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { like } from "@/query-api/calls/posts";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["post"]["data"];
    type: "compact" | "expanded";
    className?: string;
    onDelete?: () => void;
};

export const ToplineCompact = ({ data, className, type, onDelete }: Props) => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data: post_privacy } = useQuery({ key: ["post_privacy", data.id] });

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
                data={post_privacy?.edited_at}
                src="/security.svg"
                tooltip="Privacy configured"
                size={14}
            />

            <TinyTooltip
                data={data.likes}
                showData
                src="/heart.svg"
                size={10}
                tooltip="Total amount of likes"
            />

            <ul className="flex items-center gap-1 ml-auto!">
                {status && (
                    <li>
                        <Tooltip
                            text={`${data.has_liked ? "Remove like" : "Like this post"}`}
                            isEnabled={
                                post_privacy?.likes !== false ||
                                data.user_id === status?.id
                            }
                        >
                            <Button
                                aria-label={`${data.has_liked ? "unlike post" : "like post"}`}
                                onClick={() => {
                                    if (!status) {
                                        return;
                                    }

                                    like({
                                        what: "post",
                                        type: "like",
                                        id: data.id,
                                        user_id: status.id,
                                    });
                                }}
                                className={`${data.has_liked ? "invert-100!" : ""}`}
                            >
                                {data.has_liked ? (
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

                {data.user_id === status?.id && (
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

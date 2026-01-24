import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    data: Post;
    className?: string;
};

export const ToplineCompact = ({ data, className }: Props) => {
    // zustand
    const postIds = useAppStore((state) => state.postIds);
    const status = useAppStore((state) => state.status);

    return (
        <ul
            className={`box flex-row! gap-1! px-2! py-0! items-center! **:text-[#bebebe]! w-full h-10! bg-[#00000030]!
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
                <span>{data.title}</span>
            </li>

            <li className="ml-auto!">
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
    );
};

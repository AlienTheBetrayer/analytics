import { CompactInfo } from "@/features/posts/components/parts/CompactInfo";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    post: Post;
};

export const PostGridElement = ({ post }: Props) => {
    // zustand
    const postPrivacy = useAppStore((state) => state.postPrivacy);
    const postLikeIds = useAppStore((state) => state.postLikeIds);
    const status = useAppStore((state) => state.status);

    return (
        <article className="box p-2! aspect-square">
            <Tooltip
                className="w-full h-full"
                element={
                    <CompactInfo
                        post={post}
                        className="max-w-55!"
                    />
                }
            >
                <LinkButton
                    href={`/post/view/${post.id}`}
                    className="w-full h-full outline-2! hover:outline-blue-1!"
                >
                    <div className="flex gap-2 items-center absolute left-1/2 -translate-x-1/2 top-1 rounded-full p-2 backdrop-blur-md mix-blend-difference z-1">
                        {post.edited_at && (
                            <Image
                                alt="edited"
                                width={16}
                                height={16}
                                src="/pencil.svg"
                                className="mix-blend-difference invert-100!"
                            />
                        )}

                        {status && postLikeIds[status.username]?.has(post.id) && (
                            <Image
                                alt="liked"
                                width={16}
                                height={16}
                                src="/heart.svg"
                                className="mix-blend-difference invert-100!"
                            />
                        )}

                        {postPrivacy[post.id]?.edited_at && (
                            <Image
                                alt="configured"
                                width={16}
                                height={16}
                                src="/security.svg"
                                className="mix-blend-difference invert-100!"
                            />
                        )}
                    </div>

                    <Image
                        alt={post.title}
                        fill
                        style={{ objectFit: "cover" }}
                        src={`${post.image_url}`}
                        className="rounded-full invert-0!"
                    />
                </LinkButton>
            </Tooltip>
        </article>
    );
};

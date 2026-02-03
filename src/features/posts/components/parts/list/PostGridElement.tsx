import { CompactInfo } from "@/features/posts/components/parts/CompactInfo";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    id: string;
};

export const PostGridElement = ({ id }: Props) => {
    // fetching
    const { data: post, isLoading } = useQuery({ key: ["post", id] });
    const { data: postPrivacy } = useQuery({ key: ["post_privacy", id] });

    if (isLoading) {
        return <div className="box p-2! aspect-square loading" />;
    }

    if (!post) {
        return null;
    }

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

                        {!!post.has_liked && (
                            <Image
                                alt="liked"
                                width={16}
                                height={16}
                                src="/heart.svg"
                                className="mix-blend-difference invert-100!"
                            />
                        )}

                        {postPrivacy?.edited_at && (
                            <Image
                                alt="configured"
                                width={16}
                                height={16}
                                src="/security.svg"
                                className="mix-blend-difference invert-100!"
                            />
                        )}
                    </div>

                    {post.image_url && (
                        <Image
                            alt={post.title}
                            fill
                            style={{ objectFit: "cover" }}
                            src={`${post.image_url}`}
                            className="rounded-full invert-0!"
                        />
                    )}
                </LinkButton>
            </Tooltip>
        </article>
    );
};

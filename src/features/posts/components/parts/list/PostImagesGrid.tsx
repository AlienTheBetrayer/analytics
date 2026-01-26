import { CompactInfo } from "@/features/posts/components/parts/CompactInfo";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { redirect } from "next/navigation";

type Props = {
    data: { user: User; profile: Profile };
};

export const PostImagesGrid = ({ data }: Props) => {
    // zustand
    const posts = useAppStore((state) => state.posts);
    const postIds = useAppStore((state) => state.postIds);
    const postPrivacy = useAppStore((state) => state.postPrivacy);
    const likeIds = useAppStore((state) => state.likeIds);
    const status = useAppStore((state) => state.status);

    if (!postIds[data.user.username]) {
        return null;
    }

    // 8 most recent posts
    const userPosts = [...postIds[data.user.username]]
        .map((id) => posts[id])
        .sort((a, b) =>
            a.image_url && !b.image_url
                ? -1
                : !a.image_url && b.image_url
                  ? 1
                  : 0,
        )
        .slice(0, 4);

    return (
        <article className="flex flex-col gap-4">
            <div className="flex flex-col items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/notification.svg"
                />
                <span>
                    Most <mark>recent</mark> posts:
                </span>
            </div>

            <hr className="w-full max-w-64 self-center" />

            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-auto grow items-center">
                {userPosts.map(
                    (post) =>
                        post.image_url && (
                            <li
                                className="box p-2! aspect-square"
                                key={post.id}
                            >
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

                                            {status &&
                                                likeIds[status.username]?.has(
                                                    post.id,
                                                ) && (
                                                    <Image
                                                        alt="liked"
                                                        width={16}
                                                        height={16}
                                                        src="/heart.svg"
                                                        className="mix-blend-difference invert-100!"
                                                    />
                                                )}

                                            {postPrivacy[post.id]
                                                ?.edited_at && (
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
                            </li>
                        ),
                )}
            </ul>

            <hr className="w-full max-w-lg self-center" />

            <Tooltip
                text={`Go to a random post`}
                className="w-full sm:max-w-64 self-center"
            >
                <Button
                    className="w-full"
                    onClick={() => {
                        const ids = [...postIds[data.user.username]];
                        const id = ids.at(
                            Math.round(Math.random() * ids.length - 1),
                        );

                        if (!id) {
                            return;
                        }

                        redirect(`/post/view/${id}`);
                    }}
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/random.svg"
                    />
                    Random
                </Button>
            </Tooltip>
        </article>
    );
};

import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    data: { user: User; profile: Profile };
};

export const PostImagesGrid = ({ data }: Props) => {
    // zustand
    const posts = useAppStore((state) => state.posts);
    const postIds = useAppStore((state) => state.postIds);

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
        .slice(0, 8);

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

            <ul className="grid grid-cols-4 gap-2 my-auto grow">
                {userPosts.map(
                    (post) =>
                        post.image_url && (
                            <li
                                className="box p-2! aspect-square"
                                key={post.id}
                            >
                                <LinkButton
                                    href={`/post/view/${post.id}`}
                                    className="w-full h-full outline-2! hover:outline-blue-1!"
                                >
                                    {post.edited_at && (
                                        <div className="absolute left-1/2 -translate-x-1/2 top-1 rounded-full p-2 backdrop-blur-md mix-blend-difference z-2">
                                            <Image
                                                alt="edited"
                                                width={16}
                                                height={16}
                                                src="/pencil.svg"
                                                className="mix-blend-difference invert-100!"
                                            />
                                        </div>
                                    )}

                                    <Image
                                        alt={post.title}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        src={`${post.image_url}`}
                                        className="rounded-full invert-0!"
                                    />
                                </LinkButton>
                            </li>
                        ),
                )}
            </ul>
        </article>
    );
};

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

    const userPosts = [...postIds[data.user.username]]
        .map((id) => posts[id])
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

            <hr className="w-full max-w-64 self-center"/>

            <ul className="grid grid-cols-4 gap-2">
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

import { PostGridElement } from "@/features/posts/components/parts/list/PostGridElement";
import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Profile, User } from "@/types/tables/account";
import { Post } from "@/types/tables/posts";
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

    if (!postIds[data.user.username]) {
        return null;
    }

    // 4 most recent posts
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

    const postsGrid: (Post | null)[] = [
        ...userPosts,
        ...Array(4).fill(null),
    ].slice(0, 4);

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
                {postsGrid.map((post, k) => (
                    <li key={post?.id ?? k}>
                        {post?.image_url ? (
                            <PostGridElement post={post} />
                        ) : (
                            <Tooltip
                                text="Does not exist"
                                className="w-full h-full"
                            >
                                <div className="box p-2! aspect-square rounded-full! loading" />
                            </Tooltip>
                        )}
                    </li>
                ))}
            </ul>

            <hr className="w-full max-w-lg self-center" />

            <Tooltip
                text={`Go to a random post`}
                className="w-full sm:max-w-64 self-center"
                isEnabled={!!postIds[data.user.username]?.size}
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

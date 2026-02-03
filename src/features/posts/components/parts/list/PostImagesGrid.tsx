import { PostGridElement } from "@/features/posts/components/parts/list/PostGridElement";
import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { redirect } from "next/navigation";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const PostImagesGrid = ({ data }: Props) => {
    const { data: posts } = useQuery({ key: ["posts", data.id] });

    // 4 most recent posts
    const recentIds: (string | null)[] = [
        ...(posts?.slice(0, 4) ?? []),
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
                {recentIds.map((id, k) => (
                    <li key={id ?? k}>
                        {id ? (
                            <PostGridElement id={id} />
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
                isEnabled={!!posts}
            >
                <Button
                    className="w-full"
                    onClick={() => {
                        if (!posts) {
                            return;
                        }

                        const ids = [...posts];
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

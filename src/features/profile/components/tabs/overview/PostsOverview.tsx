import { PostCompact } from "@/features/posts/components/parts/compact/PostCompact";
import { NoPosts } from "@/features/profile/components/errors/NoPosts";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const PostsOverview = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-4">
            <ul className="flex flex-col items-center">
                <li>
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/select.svg"
                    />
                </li>
                <li>
                    <span>Posts:</span>
                </li>
            </ul>

            <ul className="flex flex-col gap-4 w-full justify-center relative">
                {data.post_ids?.length ? (
                    data.post_ids.map((id) => (
                        <li key={id}>
                            <PostCompact
                                id={id}
                                className="h-48!"
                            />
                        </li>
                    ))
                ) : (
                    <>
                        {Array.from({ length: 3 }, (_, k) => (
                            <li key={k}>
                                <div className="w-full h-48 rounded-4xl loading" />
                            </li>
                        ))}

                        <li className="absolute left-1/2 top-1/2 -translate-1/2">
                            <NoPosts />
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

import { PostCompact } from "@/features/posts/components/parts/compact/PostCompact";
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
                    <span>
                        Posts:
                    </span>
                </li>
            </ul>

            <ul className="flex flex-col gap-4 w-full justify-center">
                {data.post_ids.map((id) => (
                    <li key={id}>
                        <PostCompact
                            id={id}
                            className="h-48!"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

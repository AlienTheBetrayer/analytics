import { CommentList } from "@/features/posts/components/parts/comments/CommentList";
import { SendComment } from "@/features/posts/components/parts/comments/SendComment";
import { Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    data: Post;
};

export const Comments = ({ data }: Props) => {
    // zustand
    const status = useAppStore((state) => state.status);

    return (
        <ul className="flex flex-col gap-4">
            <li className="flex justify-center items-center gap-1">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/comments.svg"
                />
                <span>Comments:</span>
            </li>

            {status && (
                <li>
                    <SendComment data={data} />
                </li>
            )}

            <li>
                <CommentList data={data} />
            </li>
        </ul>
    );
};

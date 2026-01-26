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
    const commentIds = useAppStore((state) => state.commentIds);

    return (
        <ul className="flex flex-col gap-8">
            <li className="flex justify-center items-center gap-1">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/plus.svg"
                />
                <span>Add a comment:</span>
            </li>

            {status && (
                <li>
                    <SendComment data={data} />
                </li>
            )}

            <li>
                <hr />
            </li>

            <li className="flex justify-center items-center gap-1">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/comments.svg"
                />
                <span>Comments:</span>
            </li>

            {commentIds[data.id]?.size ? (
                <li>
                    <CommentList data={data} />
                </li>
            ) : (
                <li className="mx-auto!">
                    <span>
                        <small>
                            <u>No</u> comments yet...
                        </small>
                    </span>
                </li>
            )}
        </ul>
    );
};

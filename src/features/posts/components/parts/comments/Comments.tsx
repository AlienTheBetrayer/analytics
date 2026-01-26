import { CommentList } from "@/features/posts/components/parts/comments/CommentList";
import { UpdateComment } from "@/features/posts/components/parts/comments/UpdateComment";
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
    const postPrivacy = useAppStore((state) => state.postPrivacy);

    const areCommentsEditable =
        postPrivacy[data.id]?.comments !== false || status?.id === data.user_id;

    return (
        <ul className="flex flex-col gap-8">
            {status && (
                <div
                    className="flex flex-col gap-8 relative"
                    style={{
                        opacity: areCommentsEditable ? 1 : 0.3,
                    }}
                    inert={!areCommentsEditable}
                >
                    {!areCommentsEditable && (
                        <Image
                            alt="prohibited"
                            src="/prohibited.svg"
                            width={32}
                            height={32}
                            className="z-1 absolute left-1/2 top-1/2 -translate-1/2"
                        />
                    )}

                    <li className="flex justify-center items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/plus.svg"
                        />
                        <span>Add a comment:</span>
                    </li>

                    <li>
                        <UpdateComment
                            type="send"
                            data={{ post: data }}
                        />
                    </li>

                    <li>
                        <hr />
                    </li>
                </div>
            )}

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

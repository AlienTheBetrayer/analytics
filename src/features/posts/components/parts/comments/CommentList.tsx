import { CommentView } from "@/features/posts/components/parts/comments/CommentView";
import { Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";

type Props = {
    data: Post;
};

export const CommentList = ({ data }: Props) => {
    // zustand
    const comments = useAppStore((state) => state.comments);

    if (!comments[data.id]?.length) {
        return null;
    }

    return (
        <ul className="box">
            {comments[data.id].map((comment) => (
                <CommentView
                    key={comment.id}
                    data={comment}
                />
            ))}
        </ul>
    );
};

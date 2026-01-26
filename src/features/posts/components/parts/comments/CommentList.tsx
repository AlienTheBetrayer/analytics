import { CommentView } from "@/features/posts/components/parts/comments/CommentView";
import { Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";

type Props = {
    data: Post;
};

export const CommentList = ({ data }: Props) => {
    // zustand
    const commentIds = useAppStore((state) => state.commentIds);
    const comments = useAppStore((state) => state.comments);

    if (!commentIds[data.id]?.size) {
        return null;
    }

    const commentData = [...commentIds[data.id]].map(id => comments[id]);

    return (
        <ul className="box">
            {commentData.map((comment) => (
                <CommentView
                    key={comment.id}
                    data={comment}
                />
            ))}
        </ul>
    );
};

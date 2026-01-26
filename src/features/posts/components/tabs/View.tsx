import { PostExpanded } from "@/features/posts/components/parts/expanded/PostExpanded";
import { CommentList } from "@/features/posts/components/parts/replies/CommentList";
import { Post } from "@/types/tables/posts";

type Props = {
    post: Post;
};

export const View = ({ post }: Props) => {
    return (
        <div className="flex flex-col gap-2">
            <PostExpanded data={post} />
            <CommentList data={post}/>
        </div>
    );
};

import { PostExpanded } from "@/features/posts/components/parts/expanded/PostExpanded";
import { Post } from "@/types/tables/posts";
import { Comments } from "@/features/posts/components/parts/comments/Comments";

type Props = {
    post: Post;
};

export const View = ({ post }: Props) => {
    return (
        <div className="flex flex-col gap-2">
            <PostExpanded data={post} />
            <Comments data={post} />
        </div>
    );
};

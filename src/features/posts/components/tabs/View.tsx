import { PostExpanded } from "@/features/posts/components/parts/expanded/PostExpanded";
import { Post } from "@/types/tables/posts";
import { Comments } from "@/features/posts/components/parts/comments/Comments";

type Props = {
    post: Post;
};

export const View = ({ post }: Props) => {
    return (
        <div className="flex flex-col gap-4">
            <PostExpanded data={post} />
            <hr className="mt-16" />
            <Comments data={post} />
        </div>
    );
};

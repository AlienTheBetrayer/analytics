import { PostExpanded } from "@/features/posts/components/parts/expanded/PostExpanded";
import { Post } from "@/types/tables/posts";

type Props = {
    post: Post;
};

export const View = ({ post }: Props) => {
    return <PostExpanded data={post} />;
};

import { PostExpanded } from "@/features/posts/components/parts/PostExpanded";
import { Post } from "@/types/tables/posts";

type Props = {
    post: Post;
};

export const View = ({ post }: Props) => {
    return <PostExpanded data={post} />;
};

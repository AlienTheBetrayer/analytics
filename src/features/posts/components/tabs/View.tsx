import { PostExpanded } from "@/features/posts/components/parts/expanded/PostExpanded";
import { Comments } from "@/features/posts/components/parts/comments/Comments";

type Props = {
    id: string;
};

export const View = ({ id }: Props) => {
    return (
        <div className="flex flex-col gap-4">
            <PostExpanded id={id} />
            <hr className="mt-16" />
            <Comments id={id} />
        </div>
    );
};

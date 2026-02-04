import { PostExpanded } from "@/features/posts/components/parts/expanded/PostExpanded";
import { Comments } from "@/features/posts/components/parts/comments/Comments";

type Props = {
    id: string;
};

export const View = ({ id }: Props) => {
    return (
        <div className="flex flex-col gap-16">
            <PostExpanded id={id} />
            <hr/>
            <Comments id={id} />
        </div>
    );
};

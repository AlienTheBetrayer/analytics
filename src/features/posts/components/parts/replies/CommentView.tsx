import { Comment } from "@/types/tables/posts"

type Props = {
    data: Comment;
}

export const CommentView = ({ data}: Props) =>{
    return (
        <li>
            {data.id}
        </li>
    )
}
import { CommentView } from "@/features/posts/components/parts/comments/CommentView";
import { Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";
import React, { useEffect, useRef } from "react";

type Props = {
    data: Post;
};

export const CommentList = ({ data }: Props) => {
    // zustand
    const commentIds = useAppStore((state) => state.commentIds);
    const comments = useAppStore((state) => state.comments);
    const getUsers = useAppStore((state) => state.getUsers);

    // fetching profiles
    const hasFetched = useRef<boolean>(false);
    useEffect(() => {
        if (!commentIds[data.id]?.size || hasFetched.current) {
            return;
        }

        getUsers({ select: ["profile"], id: [...commentIds[data.id]] });
        hasFetched.current = true;
    }, [commentIds, data, getUsers]);

    if (!commentIds[data.id]?.size) {
        return null;
    }

    const commentData = [...commentIds[data.id]].map((id) => comments[id]);

    if (!commentData.length) {
        return null;
    }

    return (
        <ul className="flex flex-col gap-2!">
            {commentData.map((comment, i) => (
                <React.Fragment key={comment.id}>
                    <CommentView data={comment} />

                    {i < commentData.length - 1 && (
                        <hr className="w-11/12! mx-auto!" />
                    )}
                </React.Fragment>
            ))}
        </ul>
    );
};

import { CommentView } from "@/features/posts/components/parts/comments/CommentView";
import { Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";
import React, { useEffect, useRef, useState } from "react";

type Props = {
    data: Post;
};

export const CommentList = ({ data }: Props) => {
    // zustand
    const commentIds = useAppStore((state) => state.commentIds);
    const comments = useAppStore((state) => state.comments);
    const getUsers = useAppStore((state) => state.getUsers);
    const [editing, setEditing] = useState<string | null>(null);

    const commentData = [...commentIds[data.id]].map((id) => comments[id]);

    // fetching profiles
    const hasFetched = useRef<boolean>(false);
    useEffect(() => {
        if (!commentData?.length || hasFetched.current) {
            return;
        }

        getUsers({
            select: ["profile"],
            id: commentData.map((c) => c.user_id),
        });
        hasFetched.current = true;
    }, [commentData, getUsers]);

    return (
        <ul
            className={`flex flex-col gap-2! min-h-64 ${!commentData.length ? "loading" : ""}`}
        >
            {commentData?.map((comment, i) => (
                <React.Fragment key={comment.id}>
                    <CommentView
                        data={comment}
                        editing={editing}
                        onEdit={(id) => setEditing(id)}
                    />

                    {i < commentData.length - 1 && (
                        <hr className="w-11/12! mx-auto!" />
                    )}
                </React.Fragment>
            ))}
        </ul>
    );
};

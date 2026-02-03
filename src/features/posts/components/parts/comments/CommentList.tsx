import { CommentView } from "@/features/posts/components/parts/comments/CommentView";
import React, { useState } from "react";

type Props = {
    comments: string[];
};

export const CommentList = ({ comments }: Props) => {
    const [editing, setEditing] = useState<string | null>(null);

    return (
        <ul
            className={`flex flex-col gap-2! min-h-64 ${!comments.length ? "loading" : ""}`}
        >
            {comments?.map((id, i) => (
                <React.Fragment key={id}>
                    <CommentView
                        id={id}
                        editing={editing}
                        onEdit={(id) => setEditing(id)}
                    />

                    {i < comments.length - 1 && (
                        <hr className="w-11/12! mx-auto!" />
                    )}
                </React.Fragment>
            ))}
        </ul>
    );
};

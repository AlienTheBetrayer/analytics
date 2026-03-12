import { CommentView } from "@/features/posts/components/parts/comments/CommentView";
import { NoCommentsFiltered } from "@/features/posts/components/parts/errors/NoCommentsFiltered";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { queryCache } from "@/query/init";
import { useMemo, useState } from "react";

type Props = {
    comments: string[];
    filter?: string;
};

export const CommentList = ({ comments, filter }: Props) => {
    // react states
    const [editing, setEditing] = useState<string | null>(null);

    const commentIds = useMemo(() => {
        const trimmedFilter = filter?.toLowerCase().trim();

        const filtered =
            trimmedFilter ?
                comments.filter((id) =>
                    (
                        queryCache.get({
                            key: ["comment", id],
                        }) as CacheAPIProtocol["comment"]["data"]
                    )?.comment.includes(trimmedFilter),
                )
            :   comments;

        const sorted = [...filtered].sort((a, b) => {
            const commentA = queryCache.get({ key: ["comment", a] }) as CacheAPIProtocol["comment"]["data"];
            const commentB = queryCache.get({ key: ["comment", b] }) as CacheAPIProtocol["comment"]["data"];

            if (!commentA || !commentB) {
                return 0;
            }

            const createdAt = commentB.created_at.localeCompare(commentA.created_at);
            const likes = commentB.likes - commentA.likes;

            return likes || createdAt;
        });

        return sorted;
    }, [comments, filter]);

    return (
        <ul className={`flex flex-col gap-4! min-h-64 ${!comments.length ? "loading" : ""}`}>
            {commentIds?.map((id) => (
                <CommentView
                    key={id}
                    id={id}
                    editing={editing}
                    onEdit={(id) => setEditing(id)}
                />
            ))}

            {!commentIds.length && (
                <li className="loading w-full grow min-h-48 flex items-center justify-center">
                    <NoCommentsFiltered />
                </li>
            )}
        </ul>
    );
};

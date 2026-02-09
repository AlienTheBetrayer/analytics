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

    const filtered = useMemo(() => {
        return filter
            ? comments.filter((id) =>
                  (
                      queryCache.get({
                          key: ["comment", id],
                      }) as CacheAPIProtocol["comment"]["data"]
                  )?.comment.includes(filter),
              )
            : comments;
    }, [comments, filter]);

    return (
        <ul
            className={`flex flex-col gap-8! min-h-64 ${!comments.length ? "loading" : ""}`}
        >
            {filtered?.map((id) => (
                <CommentView
                    key={id}
                    id={id}
                    editing={editing}
                    onEdit={(id) => setEditing(id)}
                />
            ))}

            {!filtered.length && (
                <li className="loading w-full h-48 flex items-center justify-center">
                    <NoCommentsFiltered />
                </li>
            )}
        </ul>
    );
};

import { CommentViewTopline } from "@/features/posts/components/parts/comments/CommentViewTopline";
import { UpdateComment } from "@/features/posts/components/parts/comments/UpdateComment";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { like } from "@/query-api/calls/posts";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    id: string;
    editing: string | null;
    onEdit: (id: string | null) => void;
};

export const CommentView = ({ id, onEdit, editing }: Props) => {
    const { data: comment } = useQuery({ key: ["comment", id] });
    const { data: user } = useQuery({ key: ["user", comment?.user_id] });
    const { data: status } = useQuery({ key: ["status"] });

    console.log(comment);

    if (!user || !comment) {
        return <li className="box p-4! loading min-h-24 rounded-4xl!" />;
    }

    return (
        <li className="box min-h-24 grid! grid-cols-[48px_1fr] p-4! gap-4! hover:bg-background-a-8! duration-400! transition-all!">
            <LinkButton
                href={`/profile/${user.username}`}
                className="p-0! w-fit! h-fit!"
            >
                <ProfileImage
                    profile={user.profile}
                    width={256}
                    height={256}
                    className="w-full"
                />
            </LinkButton>

            <div className="flex flex-col gap-2">
                <CommentViewTopline
                    data={comment}
                    onEdit={() =>
                        onEdit(comment.id === editing ? null : comment.id)
                    }
                />

                <div>
                    {editing === comment.id ? (
                        <UpdateComment
                            type="edit"
                            data={{
                                comment,
                                onEdit: () => {
                                    onEdit(null);
                                },
                            }}
                        />
                    ) : (
                        <span>{comment.comment}</span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        isEnabled={!!status}
                        aria-label="like"
                        onClick={() => {
                            if (!status) {
                                return;
                            }

                            like({
                                type: "like",
                                what: "comment",
                                id: comment.id,
                                user_id: status.id,
                            });
                        }}
                        style={{
                            filter: `invert(${comment.has_liked ? 1 : 0})`,
                        }}
                    >
                        <Image
                            alt="like"
                            width={16}
                            height={16}
                            src="/like.svg"
                        />
                    </Button>

                    {!!comment.likes && <span>{comment.likes}</span>}

                    <hr className="w-px! h-1/2! self-stretch my-auto!" />

                    <Button
                        isEnabled={!!status}
                        aria-label="dislike"
                        onClick={() => {
                            if (!status) {
                                return;
                            }

                            like({
                                type: "dislike",
                                what: "comment",
                                id: comment.id,
                                user_id: status.id,
                            });
                        }}
                        style={{
                            filter: `invert(${comment.has_disliked ? 1 : 0})`,
                        }}
                    >
                        <Image
                            alt="dislike"
                            width={16}
                            height={16}
                            src="/like.svg"
                            className="-scale-100"
                        />
                    </Button>
                </div>
            </div>
        </li>
    );
};

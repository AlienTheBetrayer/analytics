import { CommentViewTopline } from "@/features/posts/components/parts/comments/CommentViewTopline";
import { UpdateComment } from "@/features/posts/components/parts/comments/UpdateComment";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Comment } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    data: Comment;
    editing: string | null;
    onEdit: (id: string | null) => void;
};

export const CommentView = ({ data, onEdit, editing }: Props) => {
    // zustand
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);
    const status = useAppStore((state) => state.status);
    const commentLikes = useAppStore((state) => state.commentLikes);
    const commentLikeIds = useAppStore((state) => state.commentLikeIds);
    const like = useAppStore((state) => state.like);

    const user = users[data.user_id];
    const profile = profiles[data.user_id];

    if (!user || !profile) {
        return <li className="box p-4! loading min-h-24 rounded-4xl!" />;
    }

    const hasLiked = status
        ? commentLikeIds[status.username]?.has(`${data.id}:like`)
        : false;
    const hasDisliked = status
        ? commentLikeIds[status.username]?.has(`${data.id}:dislike`)
        : false;

    return (
        <li className="box min-h-24 grid! grid-cols-[48px_1fr] p-4! gap-4! hover:bg-background-a-8! duration-400! transition-all!">
            <LinkButton
                href={`/profile/${user.username}`}
                className="p-0! w-fit! h-fit!"
            >
                <ProfileImage
                    profile={profile}
                    width={256}
                    height={256}
                    className="w-full"
                />
            </LinkButton>

            <div className="flex flex-col gap-2">
                <CommentViewTopline
                    data={data}
                    onEdit={() => onEdit(data.id === editing ? null : data.id)}
                />

                <div>
                    {editing === data.id ? (
                        <UpdateComment
                            type="edit"
                            data={{
                                comment: data,
                                onEdit: () => {
                                    onEdit(null);
                                },
                            }}
                        />
                    ) : (
                        <span>{data.comment}</span>
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
                                id: data.id,
                                user_id: status.id,
                            });
                        }}
                        style={{
                            filter: `invert(${hasLiked ? 1 : 0})`,
                        }}
                    >
                        <Image
                            alt="like"
                            width={16}
                            height={16}
                            src="/like.svg"
                        />
                    </Button>

                    {!!commentLikes[data.id] && (
                        <span>{commentLikes[data.id]}</span>
                    )}

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
                                id: data.id,
                                user_id: status.id,
                            });
                        }}
                        style={{
                            filter: `invert(${hasDisliked ? 1 : 0})`,
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

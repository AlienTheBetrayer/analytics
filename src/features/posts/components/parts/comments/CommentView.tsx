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
    const like = useAppStore((state) => state.like);

    const user = users[data.user_id];
    const profile = profiles[data.user_id];

    if (!user || !profile) {
        return null;
    }

    return (
        <li className="box grid! grid-cols-[42px_1fr] p-4! hover:bg-background-a-8! duration-400! transition-all!">
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

                <div className="flex items-center gap-1">
                    <Button
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
                    >
                        <Image
                            alt="like"
                            width={16}
                            height={16}
                            src="/like.svg"
                        />
                    </Button>

                    <Button
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

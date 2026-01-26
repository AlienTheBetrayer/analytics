import { CommentViewTopline } from "@/features/posts/components/parts/comments/CommentViewTopline";
import { UpdateComment } from "@/features/posts/components/parts/comments/UpdateComment";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Comment } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";
import { useState } from "react";

type Props = {
    data: Comment;
};

export const CommentView = ({ data }: Props) => {
    // zustand
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);

    const user = users[data.user_id];
    const profile = profiles[data.user_id];

    // react
    const [editing, setEditing] = useState<boolean>(false);

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
                    onEdit={() => setEditing((prev) => !prev)}
                />

                <div>
                    {editing ? (
                        <UpdateComment
                            type="edit"
                            data={{
                                comment: data,
                                onEdit: () => {
                                    setEditing(false);
                                },
                            }}
                        />
                    ) : (
                        <span>{data.comment}</span>
                    )}
                </div>
            </div>
        </li>
    );
};

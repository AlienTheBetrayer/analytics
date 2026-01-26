import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Comment } from "@/types/tables/posts";
import { relativeTime } from "@/utils/other/relativeTime";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    data: Comment;
};

export const CommentView = ({ data }: Props) => {
    // zustand
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);
    const status = useAppStore((state) => state.status);

    const user = users[data.user_id];
    const profile = profiles[data.user_id];

    if (!user || !profile) {
        return null;
    }

    return (
        <li className="box grid! grid-cols-[42px_1fr] p-4!">
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
                <ul className="flex gap-2">
                    <li className="flex items-center">
                        <LinkButton
                            styles="link"
                            href={`/profile/${user.username}`}
                            className="p-0! w-fit! h-fit!"
                        >
                            <span>
                                <mark>{user.username}</mark>
                            </span>
                        </LinkButton>
                    </li>

                    <li className="flex items-center">
                        <hr className="w-px! h-2/3! self-center" />
                    </li>

                    <li className="flex items-center">
                        <span className="flex items-center gap-0.5">
                            <small>
                                <Image
                                    alt=""
                                    width={12}
                                    height={12}
                                    src="/plus.svg"
                                />
                            </small>
                            <small>{relativeTime(data.created_at)}</small>
                        </span>
                    </li>

                    {data.edited_at && (
                        <>
                            <li className="flex items-center">
                                <hr className="w-px! h-2/3! self-center" />
                            </li>

                            <li className="flex items-center">
                                <span className="flex items-center gap-0.5">
                                    <small>
                                        <Image
                                            alt=""
                                            width={13}
                                            height={13}
                                            src="/pencil.svg"
                                        />
                                    </small>
                                    <small>
                                        {relativeTime(data.edited_at)}
                                    </small>
                                </span>
                            </li>
                        </>
                    )}

                    {status?.id === data.user_id && (
                        <li className="ml-auto!">
                            <ul className="flex items-center gap-1">
                                <li>
                                    <Tooltip text="Edit your comment">
                                        <Button>
                                            <Image
                                                alt=""
                                                width={16}
                                                height={16}
                                                src="/pencil.svg"
                                            />
                                        </Button>
                                    </Tooltip>
                                </li>

                                <li>
                                    <Tooltip text="Delete your comment">
                                        <Button>
                                            <Image
                                                alt=""
                                                width={16}
                                                height={16}
                                                src="/delete.svg"
                                            />
                                        </Button>
                                    </Tooltip>
                                </li>
                            </ul>
                        </li>
                    )}
                </ul>

                <div>
                    <span>{data.comment}</span>
                </div>
            </div>
        </li>
    );
};

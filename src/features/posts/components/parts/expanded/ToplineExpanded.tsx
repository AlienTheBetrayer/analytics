import { AuthorView } from "@/features/posts/components/parts/AuthorView";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { Post } from "@/types/tables/posts";
import { relativeTime } from "@/utils/other/relativeTime";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { redirect } from "next/navigation";

type Props = {
    data: Post;
    className?: string;
};

export const ToplineExpanded = ({ data, className }: Props) => {
    // zustand
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);
    const promises = useAppStore((state) => state.promises);
    const status = useAppStore((state) => state.status);
    const updatePost = useAppStore((state) => state.updatePost);

    const profile = profiles[data.user_id];
    const user = users[data.user_id];

    // message boxes
    const deleteBox = useMessageBox();

    return (
        <ul
            className={`box absolute! z-2 gap-1! flex flex-col p-2! w-full min-h-20 bg-[#00000030]!
                ${data.image_url ? "border-0!" : ""}
                ${className ?? ""}`}
        >
            {deleteBox.render({
                children:
                    "You will permanently delete this post and no one will be able to see it again",
                onSelect: (res) => {
                    if (res === "yes") {
                        updatePost({
                            type: "delete",
                            user_id: data.user_id,
                            id: data.id,
                            promiseKey: "deletePost",
                        });
                        redirect("/posts");
                    }
                },
            })}

            <li className="w-full relative min-h-10">
                <ul className="flex flex-wrap gap-2 w-full items-center">
                    <li className="flex items-center">
                        <Tooltip
                            pointerEvents
                            element={<AuthorView id={data.user_id} />}
                            direction="right"
                        >
                            <ProfileImage
                                profile={profile}
                                className="w-6"
                            />
                        </Tooltip>
                    </li>

                    <li className="flex items-center gap-1">
                        <span>{user.username}</span>
                    </li>

                    <li className="flex ml-auto!">
                        <ul className="flex gap-2 items-center">
                            <li className="ml-auto! flex items-center gap-1 whitespace-nowrap">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/plus.svg"
                                />
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/calendar.svg"
                                />
                                <span>{relativeTime(data.created_at)}</span>
                            </li>

                            {data.edited_at && (
                                <>
                                    <li className="flex self-stretch items-center">
                                        <hr className="w-px! h-2/3! bg-background-a-20" />
                                    </li>

                                    <li className="flex items-center gap-1 whitespace-nowrap">
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/pencil.svg"
                                        />
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/calendar.svg"
                                        />
                                        <span>
                                            {relativeTime(data.edited_at)}
                                        </span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </li>
                </ul>
            </li>

            <li className="w-full relative min-h-10">
                <ul className="flex gap-1 w-full">
                    <li className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2 whitespace-nowrap">
                        <div className="w-1 h-1 rounded-full aspect-square bg-blue-1" />
                        <span>{data.title}</span>
                    </li>

                    {status?.id === data.user_id && (
                        <>
                            <li className="ml-auto!">
                                <Tooltip text="Edit this post">
                                    <LinkButton
                                        href={`/post/edit/${data.id}`}
                                        ariaLabel="edit post"
                                    >
                                        <Image
                                            alt="edit"
                                            width={16}
                                            height={16}
                                            src="/pencil.svg"
                                        />
                                    </LinkButton>
                                </Tooltip>
                            </li>

                            <li>
                                <Tooltip text="Delete this post">
                                    <Button
                                        aria-label="delete post"
                                        onClick={deleteBox.show}
                                    >
                                        <PromiseStatus
                                            status={promises.deletePost}
                                        />

                                        <Image
                                            alt="edit"
                                            width={16}
                                            height={16}
                                            src="/delete.svg"
                                        />
                                    </Button>
                                </Tooltip>
                            </li>
                        </>
                    )}
                </ul>
            </li>
        </ul>
    );
};

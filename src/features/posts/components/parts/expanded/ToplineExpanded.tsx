import { AuthorView } from "@/features/posts/components/parts/AuthorView";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    data: Post;
    className?: string;
};

export const ToplineExpanded = ({ data, className }: Props) => {
    // zustand
    const profiles = useAppStore((state) => state.profiles);
    const status = useAppStore((state) => state.status);

    // message boxes
    const deleteBox = useMessageBox();

    return (
        <ul
            className={`box flex-row! gap-1! px-4! py-0! items-center! w-full h-10! bg-[#00000030]!
                ${data.image_url ? "border-0!" : ""}
                ${className ?? ""}`}
        >
            {deleteBox.render({
                children:
                    "You will permanently delete this post and no one will be able to see it again",
                onSelect: (res) => {
                    if (res === "yes") {
                    }
                },
            })}

            <li className="absolute left-4 top-1/2 -translate-y-1/2">
                <Tooltip
                    pointerEvents
                    element={<AuthorView />}
                    direction="right"
                >
                    <ProfileImage
                        profile={profiles[data.user_id]}
                        className="w-6"
                    />
                </Tooltip>
            </li>

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
    );
};

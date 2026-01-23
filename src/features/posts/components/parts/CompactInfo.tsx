import { Post } from "@/types/tables/posts";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    post: Post;
};

export const CompactInfo = ({ post }: Props) => {
    return (
        <ul className="box w-screen max-w-48 p-4! items-center!">
            <li className="grid grid-cols-[10%_10%_1fr] gap-1">
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
                <span>created {relativeTime(post.created_at)}</span>
            </li>

            {post.edited_at && (
                <li className="grid grid-cols-[10%_10%_1fr] gap-1">
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
                    <span>edited {relativeTime(post.edited_at)}</span>
                </li>
            )}
        </ul>
    );
};

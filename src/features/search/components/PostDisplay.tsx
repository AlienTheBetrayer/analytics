import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Post } from "@/types/tables/posts";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: Post;
};

export const PostDisplay = ({ data }: Props) => {
    return (
        <LinkButton
            className="box w-full gap-2! h-44 rounded-[3rem]!"
            href={`/post/view/${data.id}/`}
        >
            <ul className="flex flex-col w-full items-center gap-2!">
                <li>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-center z-2">
                            <em>{data.title}</em>
                        </span>
                        {data.image_url && (
                            <Image
                                alt="image"
                                fill
                                style={{ objectFit: "cover" }}
                                src={data.image_url}
                                className="invert-0!"
                            />
                        )}
                    </div>
                </li>

                <li className="flex items-center gap-2 absolute right-4 top-4 z-2">
                    {data.edited_at ? (
                        <span>
                            <em className="flex! items-center gap-1!">
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
                                edited {relativeTime(data.edited_at)}
                            </em>
                        </span>
                    ) : (
                        <span>
                            <em className="flex! items-center gap-1!">
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
                                created {relativeTime(data.created_at)}
                            </em>
                        </span>
                    )}
                </li>
            </ul>
        </LinkButton>
    );
};

import { AuthorView } from "@/features/posts/components/parts/AuthorView";
import { ToplineCompact } from "@/features/posts/components/parts/compact/ToplineCompact";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { wrapPromise } from "@/promises/core";
import { updatePost } from "@/query-api/calls/posts";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";
import { redirect } from "next/navigation";

type Props = {
    data: CacheAPIProtocol["post"]["data"];
    className?: string;
};

export const ToplineExpanded = ({ data, className }: Props) => {
    // fetching
    const { data: user } = useQuery({ key: ["user", data.user_id] });

    // message boxes
    const deleteBox = useMessageBox();

    return (
        <ul
            className={`box z-2 gap-1! flex flex-col p-2! w-full min-h-20 bg-[#00000030]! absolute!
                ${data.image_url ? "border-0!" : ""}
                ${className ?? ""}`}
        >
            {deleteBox.render({
                children:
                    "You will permanently delete this post and no one will be able to see it again",
                onSelect: (res) => {
                    if (res === "yes") {
                        wrapPromise("updatePost", () => {
                            return updatePost({
                                type: "delete",
                                user_id: data.user_id,
                                id: data.id,
                            });
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
                                profile={user?.profile}
                                className="w-6"
                            />
                        </Tooltip>
                    </li>

                    <li className="flex items-center gap-1">
                        <LinkButton
                            href={`/profile/${user?.username}`}
                            className="p-0! bg-transparent! backdrop-blur-none! border-0!"
                        >
                            <span>
                                <em>
                                    <mark>{user?.username}</mark>
                                </em>
                            </span>
                        </LinkButton>
                    </li>

                    <li className="flex ml-auto!">
                        <ul className="flex gap-2 items-center">
                            <li className="ml-auto! flex items-center gap-1 whitespace-nowrap">
                                <em>
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/plus.svg"
                                    />
                                </em>

                                <em>
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/calendar.svg"
                                    />
                                </em>

                                <span>
                                    <em>{relativeTime(data.created_at)}</em>
                                </span>
                            </li>

                            {data.edited_at && (
                                <>
                                    <li className="flex self-stretch items-center">
                                        <hr className="w-px! h-2/3!" />
                                    </li>

                                    <li className="flex items-center gap-1 whitespace-nowrap">
                                        <em>
                                            <Image
                                                alt=""
                                                width={16}
                                                height={16}
                                                src="/pencil.svg"
                                            />
                                        </em>

                                        <em>
                                            <Image
                                                alt=""
                                                width={16}
                                                height={16}
                                                src="/calendar.svg"
                                            />
                                        </em>

                                        <span>
                                            <em>
                                                {relativeTime(data.edited_at)}
                                            </em>
                                        </span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </li>
                </ul>
            </li>

            <li className="w-full relative min-h-10">
                <ToplineCompact
                    onDelete={() => {
                        deleteBox.show();
                    }}
                    data={data}
                    type="expanded"
                />
            </li>
        </ul>
    );
};

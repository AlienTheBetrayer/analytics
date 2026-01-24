import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { Post } from "@/types/tables/posts";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";

type Props =
    | {
          type: "posts";
          data?: { user: User; profile: Profile };
      }
    | {
          type: "post";
          data?: Post;
      };

export const Topline = ({ type, data }: Props) => {
    // url
    const { tab } = useParams<{ tab?: string }>();
    const path = usePathname().split("/").slice(1);

    // zustand
    const status = useAppStore((state) => state.status);
    const promises = useAppStore((state) => state.promises);
    const users = useAppStore((state) => state.users);

    const title = ((): { alt: string; src: string } => {
        switch (type) {
            case "post": {
                switch (tab) {
                    case "create": {
                        return { alt: "create", src: "/cubeadd.svg" };
                    }
                    case "edit": {
                        return { alt: "edit", src: "/pencil.svg" };
                    }
                    default: {
                        return { alt: "view", src: "/select.svg" };
                    }
                }
            }
            case "posts": {
                return { alt: "view", src: "/select.svg" };
            }
        }
    })();

    const username =
        data && users[type === "post" ? data.user_id : data.user.id].username;

    const backButton = (() => {
        switch (path[0]) {
            case "posts": {
                return {
                    topline: "Back to profile",
                    href: `/profile/${username ?? ""}`,
                };
            }
            case "post": {
                return {
                    topline: "Back to posts",
                    href: `/posts/${username ?? ""}`,
                };
            }
        }
    })();

    return (
        <ul
            className={`box p-0! gap-1! sticky! z-2 top-4 my-2! mx-auto! flex-row! max-w-400 w-full transition-all duration-500 h-10 items-center`}
        >
            <li className="absolute left-1/2 -translate-1/2 top-1/2">
                <span className="flex gap-1 items-center">
                    <div className="rounded-full w-1 h-1 bg-blue-1" />
                    <Image
                        width={16}
                        height={16}
                        alt={title.alt}
                        src={title.src}
                    />
                </span>
            </li>

            <li>
                <Tooltip text="Back home">
                    <LinkButton href="/home/">
                        <Image
                            width={16}
                            height={16}
                            alt="home"
                            src="/cube.svg"
                        />
                    </LinkButton>
                </Tooltip>
            </li>

            {backButton && (
                <li>
                    <Tooltip text={backButton.topline}>
                        <LinkButton href={backButton.href ?? "/"}>
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/back.svg"
                            />
                        </LinkButton>
                    </Tooltip>
                </li>
            )}

            <li className="ml-auto!">
                {type === "posts" && (
                    <ul>
                        {data?.user.id === status?.id && (
                            <li>
                                <Tooltip text="Create a new post">
                                    <LinkButton href={`/post/create`}>
                                        <Image
                                            width={16}
                                            height={16}
                                            alt=""
                                            src="/cubeadd.svg"
                                        />
                                        <span>Publish</span>
                                    </LinkButton>
                                </Tooltip>
                            </li>
                        )}
                    </ul>
                )}

                {type === "post" && (
                    <ul className="flex items-center gap-1">
                        {data && data.user_id === status?.id && (
                            <li>
                                <Tooltip text="Edit this post">
                                    <LinkButton
                                        href={`/post/edit/${data.id}`}
                                        ariaLabel="edit post"
                                    >
                                        <Image
                                            width={16}
                                            height={16}
                                            alt=""
                                            src="/pencil.svg"
                                        />
                                    </LinkButton>
                                </Tooltip>
                            </li>
                        )}

                        {data && data.user_id === status?.id && (
                            <li>
                                <Tooltip text="Delete this post">
                                    <Button aria-label="delete post">
                                        <PromiseStatus
                                            status={promises.deletePost}
                                        />
                                        <Image
                                            width={16}
                                            height={16}
                                            alt="del"
                                            src="/delete.svg"
                                        />
                                    </Button>
                                </Tooltip>
                            </li>
                        )}
                    </ul>
                )}
            </li>
        </ul>
    );
};

import { Tooltip } from "@/features/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Post, Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useParams } from "next/navigation";

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

    // zustand
    const status = useAppStore((state) => state.status);

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

    return (
        <ul
            className={`box p-0! gap-1! my-2! mx-auto! flex-row! max-w-400 w-full transition-all duration-500 h-10 items-center`}
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

            <li>
                <Tooltip text="Back to profile">
                    <LinkButton
                        href={`/profile/${(data && "user" in data && data.user.username) || ""}`}
                    >
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/back.svg"
                        />
                    </LinkButton>
                </Tooltip>
            </li>

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
                                        <span>Create</span>
                                    </LinkButton>
                                </Tooltip>
                            </li>
                        )}
                    </ul>
                )}

                {type === "post" && (
                    <ul>
                        {data && data.user_id === status?.id && (
                            <li>
                                <Tooltip text="Edit this post">
                                    <LinkButton href={`/post/edit/${data.id}`}>
                                        <Image
                                            width={16}
                                            height={16}
                                            alt=""
                                            src="/pencil.svg"
                                        />
                                        <span>Edit</span>
                                    </LinkButton>
                                </Tooltip>
                            </li>
                        )}

                        {data && data.user_id === status?.id && (
                            <li>
                                <Tooltip text="Delete this post">
                                    <Button>
                                        <Image
                                            width={16}
                                            height={16}
                                            alt=""
                                            src="/delete.svg"
                                        />
                                        <span>Delete</span>
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

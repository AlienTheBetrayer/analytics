import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Post, Profile, User } from "@/types/tables/account";
import Image from "next/image";

type Props =
    | {
          type: "posts";
          data: { user: User; profile: Profile };
      }
    | {
          type: "post";
          data: Post;
      };

export const Topline = ({ type, data }: Props) => {
    return (
        <ul
            className={`box p-0! gap-1! my-2! mx-auto! flex-row! max-w-400 w-full transition-all duration-500 h-10 items-center`}
        >
            <li className="absolute left-1/2 -translate-1/2 top-1/2">
                <span className="flex gap-1 items-center">
                    <div className="rounded-full w-1 h-1 bg-blue-1" />
                    <Image
                        width={14}
                        height={14}
                        alt="Posts"
                        src="/select.svg"
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

            <li className="ml-auto!">
                <ul>
                    <li>
                        <Tooltip text="All posts">
                            <LinkButton href={`/posts/${data.user.username}`}>
                                <Image
                                    width={16}
                                    height={16}
                                    alt="home"
                                    src="/type.svg"
                                />
                                <span>All</span>
                            </LinkButton>
                        </Tooltip>
                    </li>
                </ul>
            </li>
        </ul>
    );
};

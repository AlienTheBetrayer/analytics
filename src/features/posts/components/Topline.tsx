import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "@/query/core";
import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    type: "post" | "posts";
    data?: CacheAPIProtocol["post"]["data"] | null;
};

export const Topline = ({ type, data }: Props) => {
    // url
    const { tab } = useParams<{ tab?: string }>();

    // fetching
    const { data: status } = useQuery({ key: ["status"] });

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
            className={`box p-0! gap-1! sticky! z-2 top-4 my-4! mx-auto! flex-row! max-w-400 w-full transition-all duration-500 h-10 items-center`}
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

            {status && (
                <li>
                    <LinkButton href={`/posts/${status.username}`}>
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/back.svg"
                        />
                    </LinkButton>
                </li>
            )}

            <li className="ml-auto!">
                {type === "posts" && (
                    <ul>
                        {status && (
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
            </li>
        </ul>
    );
};

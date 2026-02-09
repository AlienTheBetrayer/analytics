import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const PostsAuthor = ({ data }: Props) => {
    return (
        <article className="flex flex-col gap-4 items-center">
            <ul className="flex bg-bg-2! flex-row! h-10! items-center gap-1 box p-0! w-full">
                <li>
                    <Tooltip text="Go to profile">
                        <LinkButton href={`/profile/${data.username}`}>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/launch.svg"
                            />
                        </LinkButton>
                    </Tooltip>
                </li>

                <li className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/account.svg"
                    />
                    <span>
                        <mark>{data.username}</mark>:
                    </span>
                </li>
            </ul>

            <hr className="w-full max-w-32" />

            <ProfileImage
                width={256}
                height={256}
                profile={data.profile}
                className="w-full max-w-72 aspect-square"
            />

            <hr className="w-full max-w-32" />

            <Tooltip
                text={`Go to ${data.username}'s profile`}
                className="w-full sm:max-w-64"
            >
                <LinkButton
                    href={`/profile/${data.username}`}
                    className="w-full"
                >
                    <Image
                        alt=""
                        width={13}
                        height={13}
                        src="/account.svg"
                    />
                    Profile
                </LinkButton>
            </Tooltip>
        </article>
    );
};

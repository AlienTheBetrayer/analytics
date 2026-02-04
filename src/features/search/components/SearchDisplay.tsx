import { Role } from "@/features/profile/components/parts/Role";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";
import { Gender } from "@/features/profile/components/parts/Gender";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";

type Props = {
    data: CacheAPIProtocol["search"]["data"]["ids"][number];
};

export const SearchDisplay = ({ data }: Props) => {
    return (
        <div className="box flex flex-col w-full p-4! gap-1">
            <SearchDisplayProfile data={data} />

            {!!data.post_ids.length && <SearchDisplayPosts data={data} />}
        </div>
    );
};

const SearchDisplayProfile = ({ data }: Props) => {
    // fetching
    const { data: user } = useQuery({
        key: ["user", data.id],
    });

    // fallbacks
    if (!user) {
        return null;
    }

    return (
        <Tooltip
            className="w-full"
            direction="top"
            text={`Go to ${user.username}'s profile`}
        >
            <LinkButton
                href={`/profile/${user.username}`}
                className="justify-start! p-4! min-h-24 rounded-4xl!"
            >
                <ul className="flex flex-col w-full! md:flex-row gap-4! pt-8! md:pt-0! items-center! justify-start! text-center">
                    <li
                        className="p-1! border rounded-full aspect-square"
                        style={
                            user.profile.color
                                ? { borderColor: `${user.profile.color}` }
                                : {}
                        }
                    >
                        <ProfileImage
                            className="w-32! md:w-16! h-fit! aspect-square!"
                            profile={user.profile}
                            width={256}
                            height={256}
                        />
                    </li>

                    <li className="self-stretch flex items-center justify-center">
                        <hr className="md:w-px! md:h-2/3! w-1/2!" />
                    </li>

                    <li className="flex gap-2 items-center">
                        <Role data={user} />
                        <Gender data={user} />
                    </li>

                    <li className="absolute left-1/2 top-6 md:top-4 -translate-x-1/2">
                        <span className="flex gap-1 items-center">
                            <mark>{user.username}</mark>
                        </span>
                    </li>

                    <li className="md:ml-auto! absolute right-4 top-2 md:static">
                        <span className="flex gap-1 items-center">
                            <Image
                                src="/calendar.svg"
                                width={16}
                                height={16}
                                alt=""
                            />
                            seen {relativeTime(user.last_seen_at)}
                        </span>
                    </li>
                </ul>
            </LinkButton>
        </Tooltip>
    );
};

const SearchDisplayPosts = ({ data }: Props) => {
    return (
        <ul className="flex flex-col gap-1 w-full relative">
            {data.post_ids.map((id) => (
                <SearchDisplayPost
                    id={id}
                    key={id}
                />
            ))}
        </ul>
    );
};

type PostProps = {
    id: string;
};
const SearchDisplayPost = ({ id }: PostProps) => {
    const { data: post } = useQuery({ key: ["post", id] });

    if (!post) {
        return null;
    }

    return (
        <li
            key={post.id}
            className="w-full"
        >
            <LinkButton
                href={`/post/view/${post.id}`}
                className="h-8 border-0! relative flex justify-between! rounded-lg! p-4! hover:scale-98 focus-within:scale-98"
            >
                {post.image_url && (
                    <Image
                        alt=""
                        fill
                        style={{ objectFit: "cover" }}
                        src={post.image_url}
                        className="invert-0!"
                    />
                )}

                <span className="z-2 mix-blend-difference text-white!">
                    {post.title}
                </span>

                <div className="flex items-center gap-1 z-2 mix-blend-difference">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src={`${post.edited_at ? "/pencil.svg" : "/imageadd.svg"}`}
                        className="invert-100!"
                    />
                    <span className="text-white!">
                        {relativeTime(post.edited_at || post.created_at)}
                    </span>
                </div>
            </LinkButton>
        </li>
    );
};

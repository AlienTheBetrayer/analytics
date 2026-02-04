import Image from "next/image";
import { FriendButton } from "./FriendButton";
import { relativeTime } from "@/utils/other/relativeTime";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { ProfileOverview } from "@/features/profile/components/tabs/overview/ProfileOverview";
import { PostsOverview } from "@/features/profile/components/tabs/overview/PostsOverview";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Overview = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-1 items-center">
                <li className="flex gap-1 items-center self-end">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/calendar.svg"
                    />
                    <span className="whitespace-nowrap">
                        seen {relativeTime(data.last_seen_at)}
                    </span>
                </li>
                <li className="flex gap-1 items-center">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/book.svg"
                    />
                    <span className="text-foreground-2! text-5! flex">
                        <mark>{data.username}</mark>
                        &apos;s profile
                    </span>
                </li>
                <li>
                    <span>Profile overview</span>
                </li>
            </ul>

            <hr />

            <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-4">
                <PostsOverview data={data} />
                <ProfileOverview data={data} />
            </div>

            <FriendButton data={data} />
        </div>
    );
};

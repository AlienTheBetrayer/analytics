import { Profile, User } from "@/types/tables/account";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: { user: User; profile: Profile };
};

export const LastSeen = ({ data }: Props) => {
    return (
        <div className="flex gap-1 items-center">
            <Image
                width={16}
                height={16}
                alt=""
                src="/calendar.svg"
            />
            <span className="whitespace-nowrap">
                seen {relativeTime(data.user.last_seen_at)}
            </span>
        </div>
    );
};

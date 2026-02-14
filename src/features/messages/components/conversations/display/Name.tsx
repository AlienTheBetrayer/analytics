import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"][number];
};

export const Name = ({ data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    switch (data.type) {
        case "dm": {
            const otherUser = data.conversation_members.find(
                (m) => m.user_id !== status?.id,
            )?.user;

            return <span className="truncate">{otherUser?.username}</span>;
        }
        case "group": {
            return (
                <span className="flex items-center gap-1">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/friends.svg"
                    />
                    <span>Group</span>
                </span>
            );
        }
        case "channel": {
            return (
                <span className="flex items-center gap-1">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/menu.svg"
                    />
                    <span>Channel</span>
                </span>
            );
        }
        case "notes": {
            return (
                <span className="flex items-center gap-1">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/save.svg"
                    />
                    <span>Notes</span>
                </span>
            );
        }
        default: {
            return <span>Unknown</span>;
        }
    }
};

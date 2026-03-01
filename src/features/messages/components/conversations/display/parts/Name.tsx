import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"][number];
};

export const Name = ({ data }: Props) => {
    switch (data.type) {
        case "dm": {
            return (
                <span className="truncate">
                    {data.title || data.peer?.username}
                </span>
            );
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
                    <span>{data.title || "Group"}</span>
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
                    <span>{data.title || "Channel"}</span>
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
                        src="/pencil.svg"
                    />
                    <span>{data.title || "Notes"}</span>
                </span>
            );
        }
        default: {
            return <span>Unknown</span>;
        }
    }
};

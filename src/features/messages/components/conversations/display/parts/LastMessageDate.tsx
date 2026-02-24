import { CacheAPIProtocol } from "@/query-api/protocol";
import { exactTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data?: CacheAPIProtocol["conversations"]["data"][number];
};

export const LastMessageDate = ({ data }: Props) => {
    return (
        data?.last_message && (
            <span className="flex items-center gap-1 ml-auto! whitespace-nowrap">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src={
                        data.last_message.seen_at
                            ? "/seen.svg"
                            : "/checkmark.svg"
                    }
                />
                <small>{exactTime(data.last_message.created_at)}</small>
            </span>
        )
    );
};

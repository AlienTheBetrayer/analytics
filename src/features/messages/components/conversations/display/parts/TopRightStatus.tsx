import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data?: CacheAPIProtocol["conversations"]["data"][number];
};

export const TopRightStatus = ({ data }: Props) => {
    if (!data) {
        return null;
    }

    return (
        <div className="absolute! flex gap-1 items-center justify-center right-4 top-0.5">
            {data.conversation_meta?.pinned && (
                <Image
                    alt="pin"
                    width={13}
                    height={13}
                    src="/pin.svg"
                />
            )}

            {(data.membership?.unread_amount ?? 0) > 0 && (
                <div className="flex items-center justify-center rounded-full w-3.5 h-3.5 bg-blue-2">
                    <span className="text-8! text-[#dbdbdb]!">
                        {data.membership.unread_amount}
                    </span>
                </div>
            )}
        </div>
    );
};

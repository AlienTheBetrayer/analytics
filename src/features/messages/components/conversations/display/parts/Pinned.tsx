import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data?: CacheAPIProtocol["conversations"]["data"][number];
};

export const Pinned = ({ data }: Props) => {
    if (!data?.conversation_meta?.pinned) {
        return null;
    }

    return (
        data.conversation_meta?.pinned && (
            <div className="absolute! flex items-center justify-center right-3.75 top-0 w-6! h-6!">
                <Image
                    alt="pin"
                    width={13}
                    height={13}
                    src="/pin.svg"
                />
            </div>
        )
    );
};

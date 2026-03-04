import { CacheAPIProtocol } from "@/query-api/protocol";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"][number];
};

export const MutedStatus = ({ data }: Props) => {
    if (
        !data.membership.muted_until ||
        new Date(data.membership.muted_until) < new Date()
    ) {
        return null;
    }

    return (
        <div className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2 truncate">
            <Image
                alt=""
                width={16}
                height={16}
                src="/auth.svg"
            />
            <span>Muted</span>
            <span>
                <small>
                    (unmuted {relativeTime(data.membership.muted_until)})
                </small>
            </span>
        </div>
    );
};

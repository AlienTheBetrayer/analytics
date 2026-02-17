import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    className?: string;
    data:
        | CacheAPIProtocol["noteboards"]["data"][number]["elements"][number]
        | null;
};

export const Pin = ({ className, data }: Props) => {
    if (!data || !data.pinned) {
        return null;
    }

    return (
        <Tooltip
            element={
                <div className="box flex-row! px-4! py-2! acrylic">
                    <span className="flex items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/calendar.svg"
                        />
                        <span>{relativeTime(data.pinned_at)}</span>
                    </span>
                </div>
            }
            direction="top"
            className={`ml-auto! ${className ?? ""}`}
        >
            <Image
                alt="pinned"
                width={13}
                height={13}
                src="/pin.svg"
            />
        </Tooltip>
    );
};

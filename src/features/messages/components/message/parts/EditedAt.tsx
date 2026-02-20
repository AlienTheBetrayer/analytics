import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["messages"]["data"]["messages"][number];
};

export const EditedAt = ({ data }: Props) => {
    if (!data.edited_at) {
        return null;
    }

    return (
        <Tooltip
            direction="top"
            element={
                <div className="box flex-row! px-4! py-2! acrylic">
                    <span className="flex items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/calendar.svg"
                        />
                        <span>{relativeTime(data.edited_at)}</span>
                    </span>
                </div>
            }
        >
            <Image
                alt=""
                width={14}
                height={14}
                src="/pencil.svg"
            />
        </Tooltip>
    );
};

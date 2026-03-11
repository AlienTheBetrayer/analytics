/** @format */

import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { MapType } from "@/types/other/utils";
import { relativeTime } from "@/utils/other/relativeTime";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    message: MapType<CacheAPIProtocol["messages"]["data"]["messages"]>;
};

export const EditedAt = ({ message }: Props) => {
    // zustand
    const display = useAppStore((state) => state.display.messages);

    // fallback
    if (!message.edited_at) {
        return null;
    }

    // jsx
    return (
        <Tooltip
            direction="top"
            isActive={!display.selectingMode}
            element={
                <div className="box flex-row! px-4! py-2! acrylic">
                    <span className="flex items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/calendar.svg"
                        />
                        <span>{relativeTime(message.edited_at)}</span>
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

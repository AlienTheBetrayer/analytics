/** @format */

import { ForwardTooltip } from "@/features/messages/components/message/display/ForwardTooltip";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { MapType } from "@/types/other/utils";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    message: MapType<CacheAPIProtocol["messages"]["data"]["messages"]>;
};

export const Forward = ({ message }: Props) => {
    // zustand
    const display = useAppStore((state) => state.display.messages);
    const messages = useAppStore((state) => state.messages);

    // fallback
    if (!message.forward) {
        return null;
    }

    // ui state
    const user = messages?.users?.get?.(message.forward.user_id);

    // jsx
    return (
        <Tooltip
            direction="left"
            pointerEvents
            isActive={!display.selectingMode}
            element={<ForwardTooltip message={message} />}
        >
            <div className="flex items-center p-2 gap-1.5 bg-bg-2 h-8 rounded-md w-full max-w-48">
                <span className="box flex-row! items-center justify-center gap-px! p-1! rounded-lg! bg-bg-1!">
                    <div className="w-1 h-1 rounded-full bg-orange-1" />
                    <Image
                        alt=""
                        width={14}
                        height={14}
                        src="/arrow.svg"
                    />
                </span>

                <span>from</span>

                <ProfileImage
                    profile={user?.profile}
                    width={256}
                    height={256}
                    className="w-6! h-6!"
                />
                <span className="truncate">{user?.username}</span>
            </div>
        </Tooltip>
    );
};

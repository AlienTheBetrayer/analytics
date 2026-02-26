import { ForwardTooltip } from "@/features/messages/components/message/display/ForwardTooltip";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["messages"]["data"][number];
    isActive?: boolean;
};

export const Forward = ({ data, isActive }: Props) => {
    if (!data.forward) {
        return null;
    }

    return (
        <Tooltip
            direction="left"
            pointerEvents
            isActive={isActive !== false}
            element={<ForwardTooltip data={data} />}
        >
            <div className="flex items-center p-2 gap-1.5 bg-bg-2 h-8 rounded-md w-full max-w-48">
                <span className="box flex-row! items-center justify-center gap-0! p-1! rounded-lg! bg-bg-1!">
                    <Image
                        alt=""
                        width={14}
                        height={14}
                        src="/arrow.svg"
                    />
                </span>

                <span>from</span>

                <ProfileImage
                    profile={data.forward.user.profile}
                    width={256}
                    height={256}
                    className="w-6! h-6!"
                />
                <span className="truncate">{data.forward.user.username}</span>
            </div>
        </Tooltip>
    );
};

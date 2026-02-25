import { ForwardTooltip } from "@/features/messages/components/message/display/ForwardTooltip";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["messages"]["data"][number];
};

export const Forward = ({ data }: Props) => {
    if (!data.forward) {
        return null;
    }

    return (
        <Tooltip
            direction="left"
            pointerEvents
            element={<ForwardTooltip data={data} />}
        >
            <div className="flex items-center p-2 gap-2 bg-bg-2 h-8 rounded-md w-full max-w-48">
                <span className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-3" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/arrow.svg"
                    />
                    from
                </span>
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

import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["messages"]["data"][number];
};

export const Reply = ({ data }: Props) => {
    if (!data.reply) {
        return null;
    }

    return (
        <div className="flex items-center p-2 gap-1.5 bg-bg-2 h-8 rounded-md w-full max-w-48">
            <span className="box flex-row! items-center justify-center gap-0! p-1! rounded-lg! bg-bg-1!">
                <Image
                    alt=""
                    width={14}
                    height={14}
                    src="/back.svg"
                />
            </span>

            <ProfileImage
                profile={data.reply.user.profile}
                width={256}
                height={256}
                className="w-5.5! h-5.5"
            />
            <span className="truncate">{data.reply.message}</span>
        </div>
    );
};

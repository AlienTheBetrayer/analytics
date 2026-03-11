/** @format */

import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { MapType } from "@/types/other/utils";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    message: MapType<CacheAPIProtocol["messages"]["data"]["messages"]>;
};

export const Reply = ({ message }: Props) => {
    // zustand
    const messages = useAppStore((state) => state.messages);

    // fallback
    if (!message.reply) {
        return null;
    }

    // ui states
    const user = messages?.users.get(message.reply.user_id);

    // jsx
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
                profile={user?.profile}
                width={256}
                height={256}
                className="w-5.5! h-5.5"
            />
            <span className="truncate">{message.reply.message}</span>
        </div>
    );
};

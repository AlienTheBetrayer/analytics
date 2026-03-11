/** @format */

import { EditedAt } from "@/features/messages/components/message/parts/EditedAt";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { MapType } from "@/types/other/utils";
import { exactTime } from "@/utils/other/relativeTime";
import { useAppStore } from "@/zustand/store";

type Props = {
    message: MapType<CacheAPIProtocol["messages"]["data"]["messages"]>;
};

export const Core = ({ message }: Props) => {
    // status
    const { data: status } = useQuery({ key: ["status"] });

    // zustand
    const conversation = useAppStore((state) => state.conversation);
    const messages = useAppStore((state) => state.messages);

    // ui states
    const isOurs = message.user_id === status?.id;

    // jsx
    return (
        <div className="flex items-center gap-1 relative w-full">
            {!isOurs && conversation?.type === "group" && (
                <ProfileImage
                    profile={messages?.users.get(message.user_id)?.profile}
                    width={256}
                    height={256}
                    className="w-5! h-5!"
                />
            )}

            {message.type === "loading" && (
                <div className="absolute right-0 top-0">
                    <Spinner className="w-3! h-3!" />
                </div>
            )}

            <div className="flex items-center gap-1 p-1">
                <span>{message.message}</span>
            </div>

            <div className="mt-auto ml-auto">
                <small className="flex items-center gap-0.5">
                    <EditedAt message={message} />
                    <span className="text-7!">{exactTime(message.created_at)}</span>
                </small>
            </div>
        </div>
    );
};

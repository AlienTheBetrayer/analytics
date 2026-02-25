import { EditedAt } from "@/features/messages/components/message/parts/EditedAt";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { exactTime } from "@/utils/other/relativeTime";

type Props = {
    data: CacheAPIProtocol["messages"]["data"][number];
    conversationData?: CacheAPIProtocol["conversations"]["data"][number];
};

export const Core = ({ data, conversationData }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    const isOurs = data.user_id === status?.id;

    return (
        <div className="flex items-center gap-1 relative w-full">
            {!isOurs && conversationData?.type === "group" && (
                <ProfileImage
                    profile={data.user.profile}
                    width={256}
                    height={256}
                    className="w-6! h-6!"
                />
            )}

            {data.type === "loading" && (
                <div className="absolute right-3 top-1.25">
                    <Spinner className="w-3! h-3!" />
                </div>
            )}

            <div className="flex items-center gap-1 p-1">
                <span>{data.message}</span>
            </div>

            <div className="mt-auto ml-auto">
                <small className="flex items-center gap-0.5">
                    <EditedAt data={data} />
                    <span className="text-7!">
                        {exactTime(data.created_at)}
                    </span>
                </small>
            </div>
        </div>
    );
};

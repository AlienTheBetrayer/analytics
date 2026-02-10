import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { exactTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"][number];
};

export const ConversationDisplay = ({ data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    const otherUser = data.conversation_members.find(
        (m) => m.user_id !== status?.id,
    )?.user;

    return (
        <LinkButton
            className="box p-4! flex-row! rounded-4xl! justify-start! items-start! gap-4! not-hover:bg-bg-1!"
            href={`/messages/${data.id}`}
        >
            <ProfileImage
                profile={otherUser?.profile}
                width={256}
                height={256}
                className="w-12! h-12!"
            />

            <div className="flex flex-col gap-1 w-full overflow-hidden">
                <div className="grid grid-cols-[auto_25%]">
                    <span className="truncate">{otherUser?.username}</span>

                    <span className="flex items-center gap-1 ml-auto! whitespace-nowrap">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src={
                                data.last_message[0].seen_at
                                    ? "/seen.svg"
                                    : "/checkmark.svg"
                            }
                        />
                        <small>
                            {exactTime(data.last_message[0].created_at)}
                        </small>
                    </span>
                </div>

                <small className="truncate">
                    <span>{data.last_message[0].message}</span>
                </small>
            </div>
        </LinkButton>
    );
};

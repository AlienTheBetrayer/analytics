import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"][number];
};

export const Avatar = ({ data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    return (
        <div className="shrink-0">
            {(() => {
                switch (data.type) {
                    case "dm": {
                        const otherUser = data.conversation_members.find(
                            (m) => m.user_id !== status?.id,
                        )?.user;

                        return (
                            <ProfileImage
                                profile={otherUser?.profile}
                                width={256}
                                height={256}
                                className="w-12! h-12!"
                            />
                        );
                    }
                    case "group": {
                        return (
                            <div className="rounded-full w-12 h-12 loading aspect-square flex items-center justify-center">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/friends.svg"
                                />
                            </div>
                        );
                    }
                    case "notes": {
                        <div className="rounded-full w-12 h-12 loading aspect-square flex items-center justify-center">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/save.svg"
                            />
                        </div>;
                    }
                    case "channel": {
                    }
                }
            })()}
        </div>
    );
};

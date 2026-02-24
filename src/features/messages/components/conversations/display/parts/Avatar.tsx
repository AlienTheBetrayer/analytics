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
        <div className="relative shrink-0 overflow-hidden rounded-full transition-all duration-300 w-12 h-12 loading aspect-square flex items-center justify-center">
            {data.image_url ? (
                <Image
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                    src={data.image_url}
                    className="invert-0!"
                />
            ) : (
                (() => {
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
                        case "channel": {
                            return (
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/friends.svg"
                                />
                            );
                        }
                        case "group": {
                            return (
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/friends.svg"
                                />
                            );
                        }
                        case "notes": {
                            return (
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/save.svg"
                                />
                            );
                        }
                    }
                })()
            )}
        </div>
    );
};

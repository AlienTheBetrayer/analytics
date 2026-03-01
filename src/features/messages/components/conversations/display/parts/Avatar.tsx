import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { Conversation } from "@/types/tables/messages";
import Image from "next/image";

type Props = {
    type?: Conversation["type"];
    data?: CacheAPIProtocol["conversations"]["data"][number];
    className?: string;
};

export const Avatar = ({ type, data, className }: Props) => {
    console.log(data);

    return (
        <div
            className={`relative shrink-0 overflow-hidden rounded-full transition-all duration-300 w-12 h-12 loading aspect-square flex items-center justify-center
            ${className ?? ""}`}
        >
            {data?.image_url ? (
                <Image
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                    src={data.image_url}
                    className="invert-0!"
                />
            ) : (
                (() => {
                    switch (type || data?.type) {
                        case "dm": {
                            return (
                                <ProfileImage
                                    profile={data?.peer?.profile}
                                    width={256}
                                    height={256}
                                    className="w-full! h-full!"
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
                                <div className="bg-linear-to-tr from-[#5161d5] to-[#101857] w-full h-full rounded-full flex items-center justify-center">
                                    <Image
                                        alt="notes"
                                        src="/save.svg"
                                        width={24}
                                        height={24}
                                        className="w-1/2! h-1/2! invert-90! grayscale-100"
                                    />
                                </div>
                            );
                        }
                    }
                })()
            )}
        </div>
    );
};

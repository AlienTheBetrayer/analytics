import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data?: CacheAPIProtocol["conversations"]["data"][number];
};

export const LastMessageAuthor = ({ data }: Props) => {
    if (!data?.last_message) {
        return null;
    }

    if (data.last_message.user) {
        return (
            <ProfileImage
                profile={data.last_message.user.profile}
                width={256}
                height={256}
                className="w-4.5! h-4.5!"
            />
        );
    }

    if (data.last_message.type === "system") {
        return (
            <Image
                alt=""
                width={16}
                height={16}
                src="/settings.svg"
            />
        );
    }
};

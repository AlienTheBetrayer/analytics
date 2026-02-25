import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data?: CacheAPIProtocol["conversations"]["data"][number];
};

export const LastMessageAuthor = ({ data }: Props) => {
    if (!data?.last_message) {
        return null;
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

    if (!data.last_message.user) {
        return null;
    }

    return (
        <div className="flex items-center gap-1">
            {(() => {
                switch (data.last_message.type) {
                    case "forward": {
                        return (
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/arrow.svg"
                            />
                        );
                    }
                    case "loading": {
                        return <Spinner />;
                    }
                    case "reply": {
                        return (
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/back.svg"
                            />
                        );
                    }
                }
            })()}

            <ProfileImage
                profile={data.last_message.user.profile}
                width={256}
                height={256}
                className="w-5! h-5!"
            />
        </div>
    );
};

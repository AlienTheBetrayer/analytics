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
                            <span className="box flex-row! items-center justify-center gap-0! w-5.25! h-5.25! p-0! rounded-lg! bg-bg-3!">
                                <Image
                                    alt=""
                                    width={13}
                                    height={13}
                                    src="/arrow.svg"
                                />
                            </span>
                        );
                    }
                    case "reply": {
                        return (
                            <span className="box flex-row! items-center justify-center gap-0! p-0! w-5.25! h-5.25! rounded-lg! bg-bg-3!">
                                <Image
                                    alt=""
                                    width={14}
                                    height={14}
                                    src="/back.svg"
                                />
                            </span>
                        );
                    }
                    case "loading": {
                        return <Spinner />;
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

import { Core } from "@/features/messages/components/message/display/parts/Core";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["messages"]["data"][number];
    conversationData?: CacheAPIProtocol["conversations"]["data"][number];
};

export const ForwardTooltip = ({ data, conversationData }: Props) => {
    if(!data.forward) {
        return null;
    }

    return (
        <div className="box p-4! acrylic w-screen max-w-72 items-center">
            <span className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-blue-3" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/arrow.svg"
                />
            </span>

            <ProfileImage
                profile={data.forward.user.profile}
                width={256}
                height={256}
                className="w-24! h-24!"
            />

            <LinkButton
                href={`/profile/${data.forward.user.username}`}
                className="absolute! right-2 top-2"
            >
                <div className="w-1 h-1 bg-blue-1 rounded-full"/>
                <Image
                    alt="profile"
                    width={16}
                    height={16}
                    src="/launch.svg"
                />
            </LinkButton>

            <hr/>

            <div
                className={`box not-hover:bg-bg-1! p-1.75! px-4! flex-col! rounded-3xl! w-full`}
            >
                <Core
                    data={data}
                    conversationData={conversationData}
                />
            </div>
        </div>
    );
};

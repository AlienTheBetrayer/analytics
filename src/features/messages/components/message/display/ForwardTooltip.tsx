/** @format */

import { Core } from "@/features/messages/components/message/display/parts/Core";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { MapType } from "@/types/other/utils";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    message: MapType<CacheAPIProtocol["messages"]["data"]["messages"]>;
};

export const ForwardTooltip = ({ message }: Props) => {
    // zustand
    const messages = useAppStore((state) => state.messages);

    // fallback
    if (!message.forward) {
        return null;
    }

    // ui state
    const user = messages?.users.get(message.forward.user_id);

    // jsx
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
                profile={user?.profile}
                width={256}
                height={256}
                className="w-24! h-24!"
            />

            <LinkButton
                href={`/profile/${user?.username}`}
                className="absolute! right-2 top-2"
            >
                <div className="w-1 h-1 bg-blue-1 rounded-full" />
                <Image
                    alt="profile"
                    width={16}
                    height={16}
                    src="/launch.svg"
                />
            </LinkButton>

            <hr />

            <div className={`box not-hover:bg-bg-1! p-1.75! px-4! flex-col! rounded-3xl! w-full`}>
                <Core message={message} />
            </div>
        </div>
    );
};

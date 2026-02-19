import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useQuery } from "@/query/core";
import Image from "next/image";

export const LeftMenu = () => {
    const { data: status } = useQuery({ key: ["status"] });

    return (
        <ul className="box acrylic p-4! rounded-2xl! gap-1! **:border-0! w-screen max-w-64 message-ctx">
            <li className="flex items-center gap-1 mb-6! self-center">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/description.svg"
                />
            </li>

            <li>
                <LinkButton href="/profile">
                    <ProfileImage
                        profile={status?.profile}
                        width={256}
                        height={256}
                        className="w-6! h-6!"
                    />
                    <span>{status?.username}</span>
                </LinkButton>
            </li>
        </ul>
    );
};

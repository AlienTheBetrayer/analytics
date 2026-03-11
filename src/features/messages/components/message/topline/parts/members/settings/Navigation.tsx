/** @format */

import { MemberSettingsProps } from "@/features/messages/components/message/topline/parts/members/settings/MemberSettings";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useQuery } from "@/query/core";
import Image from "next/image";

export const Navigation = ({ data }: MemberSettingsProps) => {
    // status
    const { data: status } = useQuery({ key: ["status"] });

    // jsx
    return (
        <ul className="flex flex-col gap-2 items-center *:w-full">
            <li>
                <LinkButton
                    className="w-full"
                    href={`/profile/${data.user.username}`}
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/account.svg"
                    />
                    Profile
                </LinkButton>
            </li>

            {status?.id !== data.user.id && (
                <li>
                    <LinkButton
                        className="w-full"
                        href={`/messages/u/${data.user.username}`}
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/send.svg"
                        />
                        Messages
                    </LinkButton>
                </li>
            )}
        </ul>
    );
};

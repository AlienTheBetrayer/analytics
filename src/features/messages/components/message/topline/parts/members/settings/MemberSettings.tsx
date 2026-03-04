import { Controls } from "@/features/messages/components/message/topline/parts/members/settings/Controls";
import { Navigation } from "@/features/messages/components/message/topline/parts/members/settings/Navigation";
import { Permissions } from "@/features/messages/components/message/topline/parts/members/settings/Permissions";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { CacheAPIProtocol } from "@/query-api/protocol";

export type MemberSettingsProps = {
    conversationData: CacheAPIProtocol["conversations"]["data"][number];
    data: CacheAPIProtocol["conversation_members"]["data"][number];
};

export const MemberSettings = ({
    conversationData,
    data,
}: MemberSettingsProps) => {
    return (
        <ul className="box p-4! gap-4! items-center acrylic *:w-full *:flex *:flex-col *:gap-4 h-full">
            <li className="flex items-center justify-center">
                <span className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-1" />

                    <ProfileImage
                        profile={data.user.profile}
                        width={256}
                        height={256}
                        className="w-6! h-6!"
                    />
                    <span>{data.user.username}&apos;s menu</span>
                </span>
            </li>

            <li>
                <Navigation
                    data={data}
                    conversationData={conversationData}
                />
            </li>

            <li>
                <Permissions
                    data={data}
                    conversationData={conversationData}
                />
            </li>

            <li>
                <Controls
                    data={data}
                    conversationData={conversationData}
                />
            </li>
        </ul>
    );
};

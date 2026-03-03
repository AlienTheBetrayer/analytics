import { PermissionBadges } from "@/features/messages/components/message/topline/parts/members/display/PermissionBadges";
import { MemberSettings } from "@/features/messages/components/message/topline/parts/members/MemberSettings";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversation_members"]["data"][number];
    conversationData: CacheAPIProtocol["conversations"]["data"][number];
};

export const MemberDisplay = ({ data, conversationData }: Props) => {
    return (
        <Modal
            className="w-full"
            direction="screen-middle"
            tooltipClassName="w-screen max-w-96"
            isEnabled={conversationData.membership.is_founder}
            element={() => (
                <MemberSettings
                    data={data}
                    conversationData={conversationData}
                />
            )}
        >
            <Button className="flex w-full justify-start! rounded-4xl! gap-2! p-2!">
                <div className="flex items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <ProfileImage
                            width={256}
                            height={256}
                            profile={data.user.profile}
                            className="w-10! h-10!"
                        />

                        <div className="flex flex-col">
                            <span className="flex items-center gap-1 truncate">
                                {data.user.username}
                            </span>

                            <PermissionBadges data={data} />
                        </div>
                    </div>
                </div>

                <span className="ml-auto truncate">
                    <small className="flex items-center gap-1 truncate">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/calendar.svg"
                        />
                        {relativeTime(data.user.last_seen_at)}
                    </small>
                </span>
            </Button>
        </Modal>
    );
};

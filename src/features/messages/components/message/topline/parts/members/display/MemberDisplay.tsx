import { PermissionBadges } from "@/features/messages/components/message/topline/parts/members/display/PermissionBadges";
import { MemberSettings } from "@/features/messages/components/message/topline/parts/members/MemberSettings";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversation_members"]["data"][number];
};

export const MemberDisplay = ({ data }: Props) => {
    return (
        <div className="flex items-center gap-1 w-full">
            <LinkButton
                href={`/profile/${data.user.username}`}
                className="flex w-full justify-start! rounded-4xl! gap-2! p-2!"
            >
                <div className="flex items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <ProfileImage
                            width={256}
                            height={256}
                            profile={data.user.profile}
                            className="w-9! h-9!"
                        />

                        <div className="flex flex-col">
                            <span className="truncate mx-auto">
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
            </LinkButton>

            <Modal
                direction="screen-middle"
                tooltipClassName="w-screen max-w-96"
                element={() => <MemberSettings data={data} />}
            >
                <Tooltip text="Configure member">
                    <Button>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/settings.svg"
                        />
                    </Button>
                </Tooltip>
            </Modal>
        </div>
    );
};

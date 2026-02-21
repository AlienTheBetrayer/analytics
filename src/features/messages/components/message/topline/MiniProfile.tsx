import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Profile, User } from "@/types/tables/account";
import { relativeTime } from "@/utils/other/relativeTime";

type Props = {
    data: User & { profile: Profile };
};

export const MiniProfile = ({ data }: Props) => {
    return (
        <Tooltip
            direction="top"
            text="Go to profile"
        >
            <LinkButton
                href={`/profile/${data?.username}`}
                className="gap-1!"
            >
                <ProfileImage
                    profile={data?.profile}
                    width={256}
                    height={256}
                    className="w-5! h-5!"
                />
                <span>{data?.username}</span>
                <span>
                    <small>{relativeTime(data.last_seen_at)}</small>
                </span>
            </LinkButton>
        </Tooltip>
    );
};

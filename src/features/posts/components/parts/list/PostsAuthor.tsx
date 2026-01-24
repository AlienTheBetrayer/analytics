import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Profile, User } from "@/types/tables/account";
import Image from "next/image";

type Props = {
    data: { user: User; profile: Profile };
};

export const PostsAuthor = ({ data }: Props) => {
    return (
        <article className="flex flex-col gap-4 items-center">
            <div className="flex flex-col items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/account.svg"
                />
                <span>
                    <mark>{data.user.username}</mark>&apos;s account:
                </span>
            </div>

            <hr className="w-full max-w-64" />

            <ProfileImage
                width={256}
                height={256}
                profile={data.profile}
                className="w-full max-w-72 aspect-square"
            />

            <hr className="w-full max-w-32" />

            <Tooltip
                text={`Go to ${data.user.username}'s profile`}
                className="w-full max-w-64"
            >
                <LinkButton
                    href={`/profile/${data.user.username}`}
                    className="w-full"
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/account.svg"
                    />
                    Profile
                </LinkButton>
            </Tooltip>
        </article>
    );
};

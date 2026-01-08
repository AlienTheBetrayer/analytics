import Image from "next/image";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { relativeTime } from "@/utils/other/relativeTime";
import { ProfileImage } from "./ProfileImage";
import { Profile, User } from "@/types/tables/account";

type Props = {
    data: { profile: Profile; user: User };
};

export const ProfileDisplay = ({ data }: Props) => {
    return (
        <LinkButton
            href={`/profile/${data.user.username}`}
            className="flex flex-col lg:flex-row justify-start! p-4! gap-2! h-full rounded-4xl!"
            style={
                data.profile.color
                    ? { borderColor: `${data.profile.color}` }
                    : {}
            }
        >
            <ProfileImage
                className='mt-6 lg:mt-0 w-24 lg:w-auto'
                profile={data.profile}
                width={40}
                height={40}
            />

            <hr className="lg:w-px! lg:h-full!" />

            <div className="flex gap-2 items-center">
                <span className="flex flex-col gap-1">
                    <small className="flex gap-1">
                        <Image
                            src="/type.svg"
                            width={16}
                            height={16}
                            alt=""
                        />
                        Username
                    </small>
                    <b>{data.user.username}</b>
                </span>

                {data.profile.title && (
                    <span className="flex flex-col gap-1">
                        <small className="flex gap-1">
                            <Image
                                src="/book.svg"
                                width={16}
                                height={16}
                                alt=""
                            />
                            One-liner
                        </small>
                        {data.profile.title}
                    </span>
                )}
            </div>

            <span className="absolute lg:static flex gap-1 items-center ml-auto">
                <Image
                    src="/calendar.svg"
                    width={16}
                    height={16}
                    alt=""
                />
                seen {relativeTime(data.user.last_seen_at)}
            </span>
        </LinkButton>
    );
};

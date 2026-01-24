import { Gender } from "@/features/profile/components/parts/Gender";
import { Role } from "@/features/profile/components/parts/Role";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Profile, User } from "@/types/tables/account";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: { user: User; profile: Profile };
};

export const ProfileDisplay = ({ data }: Props) => {
    return (
        <LinkButton
            className="box w-full gap-2! h-44 rounded-[3rem]!"
            href={`/profile/${data.user.username}/`}
        >
            <ul className="flex flex-col w-full items-center gap-2!">
                <li>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-center">
                            {data.user.username}
                        </span>
                        <ProfileImage
                            profile={data.profile}
                            width={256}
                            height={256}
                            className="w-full max-w-24! h-full max-h-24!"
                        />
                    </div>
                </li>

                <li>
                    <ul className="flex gap-2">
                        <li>
                            <Gender data={data} />
                        </li>

                        <li>
                            <Role data={data} />
                        </li>
                    </ul>
                </li>

                <li className="absolute right-4 top-4">
                    <span>
                        <small className="flex items-center gap-1">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/calendar.svg"
                            />
                            seen {relativeTime(data.user.last_seen_at)}
                        </small>
                    </span>
                </li>
            </ul>
        </LinkButton>
    );
};

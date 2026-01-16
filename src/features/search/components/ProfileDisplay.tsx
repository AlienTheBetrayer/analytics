import { Gender } from "@/features/profile/components/parts/Gender";
import { Role } from "@/features/profile/components/parts/Role";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Profile, User } from "@/types/tables/account";

type Props = {
    data: { user: User; profile: Profile };
};

export const ProfileDisplay = ({ data }: Props) => {
    return (
        <LinkButton
            className="box w-full gap-4! p-4! rounded-[10vw]!"
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
                            className="w-full max-w-36"
                        />
                    </div>
                </li>

                <li className="grid place-items-center w-full h-full">
                    <hr className="max-w-32!" />
                </li>

                <li>
                    <ul className="flex gap-2">
                        <li>
                            <Role data={data} />
                        </li>

                        <li>
                            <Gender data={data} />
                        </li>
                    </ul>
                </li>
            </ul>
        </LinkButton>
    );
};

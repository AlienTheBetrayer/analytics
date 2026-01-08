import { Profile, User } from "@/types/tables/account";
import Image from "next/image";

type Props = {
    data: { user: User; profile: Profile };
};

export const StatusBio = ({ data }: Props) => {
    return (
        (data.profile.bio || data.profile.status) && (
            <div className="flex flex-col items-center">
                <small className="flex gap-1">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/description.svg"
                    />
                    <span>Info</span>
                </small>
                <span>{data.profile.bio}</span>
                <span>{data.profile.status}</span>
            </div>
        )
    );
};

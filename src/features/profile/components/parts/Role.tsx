import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Profile, User } from "@/types/tables/account";
import Image from "next/image";
import { ProfileImage } from "../ProfileImage";

type Props = {
    data: { user: User; profile: Profile };
};

export const Role = ({ data }: Props) => {
    return (
        <Tooltip
            direction="bottom"
            element={
                <div className="box">
                    <ProfileImage profile={data.profile} width={64} height={64}/>
                </div>
            }
            disabledPointer={false}
        >
            <div className="flex gap-1 items-center box p-1.5! flex-row! border-0!">
                <Image
                    width={20}
                    height={20}
                    alt=""
                    src="/privacy.svg"
                />
                <span className="text-foreground-5!">
                    {data.user.role[0].toUpperCase() +
                        data.user.role.substring(1)}
                </span>
            </div>
        </Tooltip>
    );
};

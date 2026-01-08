import Image from "next/image";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import { ProfileImage } from "../../ProfileImage";
import { FriendButton } from "./FriendButton";
import { StatusBio } from "./StatusBio";
import { LastSeen } from "./LastSeen";
import { Title } from "./Title";

type Props = {
    data: { user: User; profile: Profile };
};

export const Overview = ({ data }: Props) => {
    // zustand
    const status = useAppStore((state) => state.status);

    return (
        <div className="flex flex-col gap-4 p-8 w-full grow relative">
            <div className="flex flex-col gap-2 items-center">
                <div className="flex w-full justify-between items-center relative flex-wrap">
                    <div className="absolute left-1/2 top-1/2 -translate-1/2 flex gap-2 items-center">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/friends.svg"
                            className="invert-80!"
                        />
                        <span className="text-foreground-2! text-5! text-center w-full whitespace-nowrap">
                            {data.user.username}
                            &apos;s profile
                        </span>
                    </div>

                    <div className="flex gap-1 items-center"></div>
                </div>

                <span>Profile overview</span>
            </div>

            <hr className="w-2/3! mx-auto" />

            <div className="flex flex-col gap-2 grow items-center justify-center">
                {data.user.id !== status?.id && <LastSeen data={data} />}

                <span className="text-3! text-foreground-2!">
                    <mark>{data.profile.name}</mark>
                </span>

                <hr className="w-1/5!" />

                <Title data={data} />

                <ProfileImage
                    profile={data.profile}
                    width={256}
                    height={256}
                    className="w-full max-w-80 aspect-square hover:scale-105 duration-1000!"
                />

                <div className="flex gap-1 items-center">
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

                <hr className="w-2/5!" />

                <StatusBio data={data} />
                <FriendButton data={data} />
            </div>
        </div>
    );
};

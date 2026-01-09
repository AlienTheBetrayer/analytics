import Image from "next/image";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import { ProfileImage } from "../../ProfileImage";
import { FriendButton } from "./FriendButton";
import { StatusBio } from "./StatusBio";
import { LastSeen } from "./LastSeen";
import { Title } from "./Title";
import { Role } from "../../parts/Role";
import { ColorSwatches } from "../../parts/ColorSwatches";

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
                            src="/book.svg"
                            className="invert-60!"
                        />
                        <span className="text-foreground-4! text-5! text-center w-full whitespace-nowrap">
                            <mark>{data.user.username}</mark>
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
                    {data.profile.name}
                </span>

                <hr className="w-1/5!" />

                <Title data={data} />

                <ProfileImage
                    profile={data.profile}
                    width={256}
                    height={256}
                    className="w-full max-w-80 aspect-square hover:scale-102 outline-1 duration-500!"
                    style={{
                        outlineColor: data.profile.color ?? "transparent",
                    }}
                />

                <Role data={data} />

                <ColorSwatches data={data} />
                <hr className="w-2/5!" />

                <StatusBio data={data} />

                <hr className="w-1/5!" />
                <FriendButton data={data} />
            </div>
        </div>
    );
};

import Image from "next/image";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import { ProfileImage } from "../../ProfileImage";
import { FriendButton } from "./FriendButton";
import { StatusBio } from "./StatusBio";
import { LastSeen } from "./LastSeen";
import { Title } from "./Title";
import { ColorSwatches } from "../../parts/ColorSwatches";
import { Gender } from "../../parts/Gender";
import { Role } from "../../parts/Role";

type Props = {
    data: { user: User; profile: Profile };
};

export const Overview = ({ data }: Props) => {
    // zustand
    const status = useAppStore((state) => state.status);

    return (
        <div className="flex flex-col gap-4 p-8 w-full grow relative">
            <div className="flex flex-col gap-2 items-center">
                <div className="flex gap-1 items-center">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/book.svg"
                        style={{ filter: `invert(var(--invert-8))` }}
                    />
                    <span className="text-foreground-2! text-5! flex">
                        <mark>{data.user.username}</mark>
                        &apos;s profile
                    </span>
                </div>
                <span>Profile overview</span>
            </div>

            <hr className="w-2/3! mx-auto" />

            <div className="flex flex-col gap-2 grow items-center justify-center">
                <LastSeen data={data} />

                <span className="text-4! text-foreground-3!">
                    {data.profile.name}
                </span>

                <hr className="w-1/5!" />

                {data.profile.title && <Title data={data} />}

                {data.profile.color && <ColorSwatches data={data} />}
                <ProfileImage
                    profile={data.profile}
                    width={256}
                    height={256}
                    className="w-full max-w-80 aspect-square hover:scale-102 outline-1 duration-500!"
                    style={{
                        outlineColor: data.profile.color ?? "transparent",
                    }}
                />

                <div className="flex items-center gap-2">
                    {data.profile.gender && <Gender data={data} />}
                    <Role data={data} />
                </div>

                <hr className="w-2/5!" />

                {(data.profile.bio || data.profile.status) && (
                    <StatusBio data={data} />
                )}

                <hr className="w-1/5!" />
                <FriendButton data={data} />
            </div>
        </div>
    );
};

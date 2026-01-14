import Image from "next/image";
import { Profile, User } from "@/types/tables/account";
import { ProfileImage } from "../../ProfileImage";
import { FriendButton } from "./FriendButton";
import { ColorSwatches } from "../../parts/ColorSwatches";
import { Gender } from "../../parts/Gender";
import { Role } from "../../parts/Role";
import { relativeTime } from "@/utils/other/relativeTime";

type Props = {
    data: { user: User; profile: Profile };
};

export const Overview = ({ data }: Props) => {
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

            <hr />

            <div className="flex flex-col gap-4 grow items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="flex gap-1 items-center">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/calendar.svg"
                        />
                        <span className="whitespace-nowrap">
                            seen {relativeTime(data.user.last_seen_at)}
                        </span>
                    </div>

                    <span className="text-4! text-foreground-3!">
                        {data.profile.name}
                    </span>
                </div>

                <hr className="w-1/12!" />

                <div className="flex flex-col gap-2 items-center">
                    <span>{data.profile.title}</span>

                    <ProfileImage
                        profile={data.profile}
                        width={256}
                        height={256}
                        className="w-full max-w-80 aspect-square hover:scale-102 outline-1 duration-500!"
                        style={{
                            outlineColor: data.profile.color ?? "transparent",
                        }}
                    />
                </div>

                <hr className="w-1/12!" />

                {data.profile.color && <ColorSwatches data={data} />}

                <div className="flex items-center gap-2">
                    {data.profile.gender && <Gender data={data} />}
                    <Role data={data} />
                </div>

                <hr className="w-1/12!" />

                {(data.profile.bio || data.profile.status) && (
                    <div className="flex flex-col items-center">
                        <small className="flex gap-1">
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/menu.svg"
                            />
                            <span>Bio & Status</span>
                        </small>
                        <span>{data.profile.bio}</span>
                        <span>{data.profile.status}</span>
                    </div>
                )}

                <FriendButton data={data} />
            </div>
        </div>
    );
};

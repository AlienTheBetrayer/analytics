import Image from "next/image";
import { ProfileImage } from "../../ProfileImage";
import { FriendButton } from "./FriendButton";
import { ColorSwatches } from "../../parts/ColorSwatches";
import { Gender } from "../../parts/Gender";
import { Role } from "../../parts/Role";
import { relativeTime } from "@/utils/other/relativeTime";
import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Overview = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-4 w-full grow relative">
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
                        <mark>{data.username}</mark>
                        &apos;s profile
                    </span>
                </div>
                <span>Profile overview</span>
            </div>

            <hr />

            <ul className="flex flex-col gap-4 grow items-center justify-center">
                <li className="flex flex-col items-center">
                    <div className="flex gap-1 items-center">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/calendar.svg"
                        />
                        <span className="whitespace-nowrap">
                            seen {relativeTime(data.last_seen_at)}
                        </span>
                    </div>

                    <span className="text-4! text-foreground-3!">
                        {data.profile.name}
                    </span>
                </li>

                <li className="w-1/12!">
                    <hr />
                </li>

                <li className="flex flex-col gap-2 items-center">
                    {data.profile.title && <span>{data.profile.title}</span>}

                    <ProfileImage
                        profile={data.profile}
                        width={256}
                        height={256}
                        className="w-full max-w-80 aspect-square hover:scale-102 outline-1 duration-500!"
                        style={{
                            outlineColor: data.profile.color ?? "transparent",
                        }}
                    />
                </li>

                <li className="w-1/12!">
                    <hr />
                </li>

                <li>{data.profile.color && <ColorSwatches data={data} />}</li>

                <li>
                    <ul className="flex items-center gap-4">
                        <li>{data.profile.gender && <Gender data={data} />}</li>
                        <li>
                            <Role data={data} />
                        </li>
                    </ul>
                </li>

                <li className="w-1/12!">
                    <hr />
                </li>

                {data.profile.bio && (
                    <li className="flex flex-col items-center gap-1">
                        <small className="flex gap-1">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/menu.svg"
                            />
                            <span>Bio</span>
                        </small>

                        <span>{data.profile.bio}</span>
                    </li>
                )}

                {data.profile.status && (
                    <li className="flex flex-col items-center gap-1">
                        <small className="flex gap-1">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/menu.svg"
                            />
                            <span>Status</span>
                        </small>

                        <span>{data.profile.status}</span>
                    </li>
                )}

                <li>
                    <FriendButton data={data} />
                </li>
            </ul>
        </div>
    );
};

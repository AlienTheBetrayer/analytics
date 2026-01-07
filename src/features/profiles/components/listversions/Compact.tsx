import React from "react";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import type { Profiles } from "@/types/zustand/user";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import Image from "next/image";
import { relativeTime } from "@/utils/other/relativeTime";
import { Tooltip } from "@/features/tooltip/components/Tooltip";

type Props = {
    profiles: Profiles;
};

export const Compact = ({ profiles }: Props) => {
    return (
        <ul className="flex flex-col gap-2">
            {Object.values(profiles).map((data) => (
                <React.Fragment key={data.user.id}>
                    <li className="flex w-full">
                        <Tooltip
                            className="w-full"
                            direction="top"
                            text={`Go to ${data.user.username}'s profile`}
                        >
                            <LinkButton
                                className="flex flex-col w-full p-2! gap-2 items-start! rounded-4xl!"
                                style={
                                    data.profile.color
                                        ? {
                                              outline: `1px solid ${data.profile.color}`,
                                          }
                                        : {}
                                }
                                href={`/profile/${data.user.username}`}
                            >
                                <div className="flex w-full gap-2 h-full">
                                    <ul className="grid grid-cols-[auto_20%_1fr_30%] w-full gap-2">
                                        <li>
                                            <ProfileImage
                                                profile={data.profile}
                                                width={48}
                                                height={48}
                                                className="w-12 aspect-square"
                                            />
                                        </li>
                                        <li>
                                            <div className="flex flex-col">
                                                <small className="flex gap-1">
                                                    <Image
                                                        src="/type.svg"
                                                        width={16}
                                                        height={16}
                                                        alt=""
                                                    />
                                                    <span>Name</span>
                                                </small>
                                                <span>
                                                    <b>
                                                        <mark>
                                                            {data.profile.name}
                                                        </mark>
                                                    </b>
                                                </span>
                                            </div>
                                        </li>

                                        <li>
                                            <div className="flex flex-col">
                                                <small className="flex gap-1">
                                                    <Image
                                                        src="/type.svg"
                                                        width={16}
                                                        height={16}
                                                        alt=""
                                                    />
                                                    <span>One-liner</span>
                                                </small>
                                                <span>
                                                    {data.profile.oneliner}
                                                </span>
                                            </div>
                                        </li>

                                        <li className="ml-auto!">
                                            <div className="flex flex-col">
                                                <small className="flex gap-1">
                                                    <Image
                                                        src="/calendar.svg"
                                                        width={16}
                                                        height={16}
                                                        alt=""
                                                    />
                                                    <span>Last seen</span>
                                                </small>
                                                <span>
                                                    {relativeTime(
                                                        data.user.last_seen_at
                                                    )}
                                                </span>
                                            </div>
                                        </li>
                                    </ul>

                                    <span className="ml-auto"></span>
                                </div>
                            </LinkButton>
                        </Tooltip>
                    </li>
                    <hr />
                </React.Fragment>
            ))}
        </ul>
    );
};

import React from "react";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import type { Profiles } from "@/types/zustand/user";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";
import { Tooltip } from "@/features/tooltip/components/Tooltip";

type Props = {
    profiles: Profiles;
};

export const Mobile = ({ profiles }: Props) => {
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
                                className="flex flex-col w-full items-center justify-center p-4! gap-2 rounded-4xl!"
                                style={
                                    data.profile.color
                                        ? {
                                              outline: `1px solid ${data.profile.color}`,
                                          }
                                        : {}
                                }
                                href={`/profile/${data.user.username}`}
                            >
                                <ul className="**:text-center *:flex *:items-center *:justify-center *:w-full flex flex-col gap-2">
                                    <li>
                                        <ProfileImage
                                            profile={data.profile}
                                            width={64}
                                            height={64}
                                            className="aspect-square w-32!"
                                        />
                                    </li>
                                    <li>
                                        <b>
                                            <mark>{data.profile.name}</mark>
                                        </b>
                                    </li>
                                    <li>
                                        <span className="flex items-center gap-1">
                                            <small>
                                                <Image
                                                    src="/calendar.svg"
                                                    width={16}
                                                    height={16}
                                                    alt=""
                                                />
                                            </small>
                                            <span>
                                                seen{" "}
                                                {relativeTime(
                                                    data.user.last_seen_at
                                                )}
                                            </span>
                                        </span>
                                    </li>
                                    {data.profile.oneliner && (
                                        <li>
                                            <span>
                                                <b>{data.profile.oneliner}</b>
                                            </span>
                                        </li>
                                    )}
                                    {data.profile.status && (
                                        <>
                                            <hr />
                                            <li className="flex flex-col">
                                                <span>
                                                    <small className="flex items-center gap-1">
                                                        <Image
                                                            src="/type.svg"
                                                            width={16}
                                                            height={16}
                                                            alt=""
                                                        />
                                                        Status
                                                    </small>
                                                </span>
                                                <span>
                                                    {data.profile.status}
                                                </span>
                                            </li>
                                        </>
                                    )}
                                    {data.profile.bio && (
                                        <li className="flex flex-col">
                                            <span>
                                                <small className="flex items-center gap-1">
                                                    <Image
                                                        src="/description.svg"
                                                        width={16}
                                                        height={16}
                                                        alt=""
                                                    />
                                                    Bio
                                                </small>
                                            </span>
                                            <span>{data.profile.bio}</span>
                                        </li>
                                    )}
                                </ul>
                            </LinkButton>
                        </Tooltip>
                    </li>
                    <hr />
                </React.Fragment>
            ))}
        </ul>
    );
};

import React from "react";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import type { Profiles } from "@/types/zustand/user";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { relativeTime } from "@/utils/relativeTime";

type Props = {
    profiles: Profiles;
};

export const Mobile = ({ profiles }: Props) => {
    return (
        <ul className="flex flex-col gap-2">
            {Object.values(profiles).map((data) => (
                <React.Fragment key={data.user.id}>
                    <li className="flex w-full">
                        <LinkButton
                            className="flex flex-col w-full items-center justify-center p-4! gap-2 rounded-2xl!"
                            style={
                                data.profile.color
                                    ? { outline: `1px solid ${data.profile.color}` }
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
                                    <span className="flex flex-col">
                                        <b>
                                            <mark>{data.profile.name}</mark>
                                        </b>
                                        <span>seen {relativeTime(data.user.last_seen_at)}</span>
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
                                        <li>
                                            <span>{data.profile.status}</span>
                                        </li>
                                    </>
                                )}
                                {data.profile.bio && (
                                    <li>
                                        <span>{data.profile.bio}</span>
                                    </li>
                                )}
                            </ul>
                        </LinkButton>
                    </li>
                    <hr />
                </React.Fragment>
            ))}
        </ul>
    );
};

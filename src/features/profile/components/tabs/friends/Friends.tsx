import { Profile, User } from "@/types/tables/account";
import { ProfileImage } from "../../ProfileImage";
import { Role } from "../../parts/Role";
import { Select } from "./Select";
import { useEffect } from "react";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    data: { profile: Profile; user: User };
};

export const Friends = ({ data }: Props) => {
    // zustand
    const friends = useAppStore((state) => state.friends);
    const friendRequests = useAppStore((state) => state.friendRequests);
    const getUsers = useAppStore((state) => state.getUsers);

    useEffect(() => {
        getUsers({
            select: ["friends", "friend_requests"],
            id: [data.user.id],
        });
    }, [getUsers, data]);

    useEffect(() => {
        getUsers({
            select: ["profile"],
            id: [
                ...(friends[data.user.id] ?? []),
                ...(friendRequests?.[data.user.id]?.incoming ?? []),
                ...(friendRequests?.[data.user.id]?.outcoming ?? []),
            ],
        });
    }, [friends, friendRequests, data, getUsers]);

    return (
        <div className="flex flex-col gap-4 p-8 w-full grow">
            <div className="flex flex-col gap-2 items-center">
                <div className="flex gap-1 items-center">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/friends.svg"
                        style={{ filter: `invert(var(--invert-8))` }}
                    />
                    <span className="text-foreground-2! text-5! flex">
                        <mark>{data.user.username}</mark>
                        &apos;s profile
                    </span>
                </div>
                <span>Friends & Friend requests</span>
            </div>

            <hr />

            <div className="grid lg:grid-cols-[30%_auto_1fr] gap-4 grow">
                <div className="flex flex-col items-center gap-2">
                    <span>{data.profile.name}</span>
                    <ProfileImage
                        profile={data.profile}
                        width={256}
                        height={256}
                    />
                    <Role data={data} />
                </div>

                <hr className="sm:w-px! sm:h-full" />

                <Select data={data} />
            </div>
        </div>
    );
};

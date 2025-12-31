import Image from "next/image";
import { useMemo } from "react";
import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { promiseStatus } from "@/utils/status";
import { useAppStore } from "@/zustand/store";
import { ProfileImage } from "../ProfileImage";
import { relativeTime } from "@/utils/relativeTime";
import { Tooltip } from "@/features/tooltip/components/Tooltip";

type Props = {
    data: { profile: Profile; user: User };
};

export const Overview = ({ data }: Props) => {
    // zustand
    const status = useAppStore((state) => state.status);
    const friendRequests = useAppStore((state) => state.friendRequests);
    const friends = useAppStore((state) => state.friends);
    const promises = useAppStore((state) => state.promises);

    // zustand functinos
    const sendFriendRequest = useAppStore((state) => state.sendFriendRequest);
    const unfriend = useAppStore((state) => state.unfriend);
    const deleteFriendRequest = useAppStore((state) => state.deleteFriendRequest);

    // message boxes
    const unfriendMessageBox = usePopup(({ hide }) => (
        <MessageBox
            description="You are about to delete this user from your friends!"
            onInteract={(res) => {
                hide();
                if (res === "yes" && status) {
                    unfriend(status.user.id, data.user.id);
                }
            }}
        />
    ));

    // ui states
    const hasOutcomingRequest = useMemo(() => {
        if (status === undefined) return false;
        return friendRequests?.outcoming.some((id) => id === data.user.id);
    }, [friendRequests, status, data]);

    const hasIncomingRequest = useMemo(() => {
        if (status === undefined) return false;
        return friendRequests?.incoming.some((id) => id === data.user.id);
    }, [friendRequests, status, data]);

    return (
        <div className="flex flex-col gap-4 p-8 w-full grow relative">
            {unfriendMessageBox.render()}

            <div className="flex flex-col gap-2 items-center">
                <div className="flex w-full justify-between items-center relative">
                    {data.user.id !== status?.user.id && (
                        <div className="flex gap-1 items-center">
                            <Image width={16} height={16} alt="" src="/calendar.svg" />
                            <span className="whitespace-nowrap">
                                seen {relativeTime(data.user.last_seen_at)}
                            </span>
                        </div>
                    )}

                    <div className="absolute left-1/2 top-1/2 -translate-1/2 flex gap-1 items-center">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/friends.svg"
                            className="invert-80!"
                        />
                        <span className="text-foreground-2! text-5! text-center w-full">
                            {data.user.username}
                            &apos;s profile
                        </span>
                    </div>

                    {status && status.user.id !== data.user.id && (
                        <Tooltip text="Go back to your friends tab">
                            <LinkButton href={`/profile/${status.user.username}/friends`}>
                                <Image width={16} height={16} alt="" src="/back.svg" />
                                <span>Back</span>
                            </LinkButton>
                        </Tooltip>
                    )}
                </div>

                <span>Profile overview</span>
            </div>

            <hr className="w-2/3! mx-auto" />

            <div className="flex flex-col gap-2 grow items-center justify-center">
                <span className="text-3! text-foreground-2!">
                    <mark>{data.profile.name}</mark>
                </span>

                <hr className="w-1/5!" />

                {data.profile.oneliner && (
                    <div className="flex flex-col items-center">
                        <small className="flex gap-1 items-center">
                            <Image width={16} height={16} alt="" src="/server.svg" />
                            <span>Title</span>
                        </small>
                        <span className="text-foreground-5!">{data.profile.oneliner}</span>
                    </div>
                )}

                <ProfileImage
                    profile={data.profile}
                    width={256}
                    height={256}
                    className="w-full max-w-80 aspect-square hover:scale-105 duration-1000!"
                />

                <div className="flex gap-1 items-center">
                    <Image width={20} height={20} alt="" src="/privacy.svg" />
                    <span className="text-foreground-5!">
                        {data.user.role[0].toUpperCase() + data.user.role.substring(1)}
                    </span>
                </div>

                <hr className="w-2/5!" />

                {(data.profile.bio || data.profile.status) && (
                    <div className="flex flex-col items-center">
                        <small className="flex gap-1">
                            <Image width={16} height={16} alt="" src="/description.svg" />
                            <span>Info</span>
                        </small>
                        <span>{data.profile.bio}</span>
                        <span>{data.profile.status}</span>
                    </div>
                )}

                <div className="flex justify-center items-center w-full min-h-8">
                    {status &&
                        status.user.id !== data.user.id &&
                        (friends?.some((id) => id === data.user.id) ? (
                            <Button
                                onClick={() => {
                                    unfriendMessageBox.show();
                                }}
                            >
                                {promiseStatus(promises.unfriend)}
                                <Image src="/unfriend.svg" width={16} height={16} alt="unfriend" />
                                Unfriend
                            </Button>
                        ) : hasIncomingRequest ? (
                            <div className="flex gap-1 items-center">
                                <Tooltip direction="top" text="Accept this friend request">
                                    <Button
                                        onClick={() => {
                                            sendFriendRequest(status.user.id, data.user.id);
                                        }}
                                    >
                                        {promiseStatus(promises.friend_request)}
                                        <Image
                                            src="/checkmark.svg"
                                            width={16}
                                            height={16}
                                            alt="accept"
                                        />
                                        Accept
                                    </Button>
                                </Tooltip>

                                <Tooltip direction="top" text="Reject this friend request">
                                    <Button
                                        onClick={() => {
                                            deleteFriendRequest(status.user.id, data.user.id);
                                        }}
                                    >
                                        {promiseStatus(promises.delete_friend_request)}
                                        <Image
                                            src="/cross.svg"
                                            width={16}
                                            height={16}
                                            alt="reject"
                                        />
                                        Reject
                                    </Button>
                                </Tooltip>
                            </div>
                        ) : hasOutcomingRequest ? (
                            <div className="flex gap-1">
                                <Tooltip
                                    direction="top"
                                    text={`Wait for ${data.user.username} to respond`}
                                >
                                    <Button isEnabled={false}>
                                        {promiseStatus(promises.friend_request)}
                                        <Image
                                            src="/friends.svg"
                                            width={16}
                                            height={16}
                                            alt="sent"
                                        />
                                        Sent
                                    </Button>
                                </Tooltip>

                                <Tooltip direction="top" text="Unsend this request">
                                    <Button
                                        onClick={() => {
                                            deleteFriendRequest(status.user.id, data.user.id);
                                        }}
                                    >
                                        {promiseStatus(promises.delete_friend_request)}
                                        <Image
                                            src="/auth.svg"
                                            width={16}
                                            height={16}
                                            alt="reject"
                                        />
                                        Cancel
                                    </Button>
                                </Tooltip>
                            </div>
                        ) : (
                            <Tooltip direction="top" text="Send a friend request">
                                <Button
                                    onClick={() => {
                                        sendFriendRequest(status.user.id, data.user.id);
                                    }}
                                >
                                    {promiseStatus(promises.friend_request)}
                                    <Image src="/plus.svg" width={16} height={16} alt="send" />
                                    Send
                                </Button>
                            </Tooltip>
                        ))}
                </div>
            </div>
        </div>
    );
};

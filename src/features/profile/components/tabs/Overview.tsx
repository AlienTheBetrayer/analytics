import Image from "next/image";
import { useMemo } from "react";
import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import { ProfileImage } from "../ProfileImage";
import { relativeTime } from "@/utils/other/relativeTime";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { RoleEditing } from "../modals/RoleEditing";
import { promiseStatus } from "@/utils/other/status";

type Props = {
    data: { user: User; profile: Profile };
};

export const Overview = ({ data }: Props) => {
    // zustand
    const status = useAppStore((state) => state.status);
    const friendRequests = useAppStore((state) => state.friendRequests);
    const friends = useAppStore((state) => state.friends);
    const promises = useAppStore((state) => state.promises);

    // zustand functinos
    const modifyFriendship = useAppStore((state) => state.modifyFriendship);

    // message boxes
    const unfriendMessageBox = usePopup(({ hide }) => (
        <MessageBox
            description="You are about to delete this user from your friends!"
            onInteract={(res) => {
                hide();
                if (res === "yes" && status) {
                    modifyFriendship({
                        from_id: status.id,
                        to_id: data.user.id,
                        type: "unfriend",
                        promiseKey: "unfriend",
                    });
                }
            }}
        />
    ));

    // ui states
    const hasOutcomingRequest = useMemo(() => {
        return (
            status && friendRequests[status.id]?.outcoming?.has(data.user.id)
        );
    }, [friendRequests, status, data]);

    const hasIncomingRequest = useMemo(() => {
        return status && friendRequests[status.id]?.incoming?.has(data.user.id);
    }, [friendRequests, status, data]);

    return (
        <div className="flex flex-col gap-4 p-8 w-full grow relative">
            {unfriendMessageBox.render()}

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

                    <div className="flex gap-1 items-center">
                        {status && status.role === "op" && (
                            <Tooltip
                                type="modal"
                                direction="bottom-right"
                                disabledPointer={false}
                                element={<RoleEditing data={data} />}
                            >
                                <Button>
                                    <Image
                                        width={16}
                                        height={16}
                                        alt=""
                                        src="/cube.svg"
                                    />
                                </Button>
                            </Tooltip>
                        )}

                        {status && status.id !== data.user.id && (
                            <Tooltip text="Go back to friends">
                                <LinkButton
                                    href={`/profile/${status.username}/friends`}
                                >
                                    <Image
                                        width={16}
                                        height={16}
                                        alt=""
                                        src="/back.svg"
                                    />
                                    <span>Back</span>
                                </LinkButton>
                            </Tooltip>
                        )}
                    </div>
                </div>

                <span>Profile overview</span>
            </div>

            <hr className="w-2/3! mx-auto" />

            <div className="flex flex-col gap-2 grow items-center justify-center">
                {data.user.id !== status?.id && (
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
                )}

                <span className="text-3! text-foreground-2!">
                    <mark>{data.profile.name}</mark>
                </span>

                <hr className="w-1/5!" />

                {data.profile.title && (
                    <div className="flex flex-col items-center">
                        <small className="flex gap-1 items-center">
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/server.svg"
                            />
                            <span>Title</span>
                        </small>
                        <span className="text-foreground-5!">
                            {data.profile.title}
                        </span>
                    </div>
                )}

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

                {(data.profile.bio || data.profile.status) && (
                    <div className="flex flex-col items-center">
                        <small className="flex gap-1">
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/description.svg"
                            />
                            <span>Info</span>
                        </small>
                        <span>{data.profile.bio}</span>
                        <span>{data.profile.status}</span>
                    </div>
                )}

                <div className="flex justify-center items-center w-full min-h-8">
                    {status &&
                        status.id !== data.user.id &&
                        (friends[data.user.id]?.has(status.id) ? (
                            <Button
                                onClick={() => {
                                    unfriendMessageBox.show();
                                }}
                            >
                                {promiseStatus(promises.unfriend)}
                                <Image
                                    src="/unfriend.svg"
                                    width={16}
                                    height={16}
                                    alt="unfriend"
                                />
                                Unfriend
                            </Button>
                        ) : hasIncomingRequest ? (
                            <div className="flex gap-1 items-center">
                                <Tooltip
                                    direction="top"
                                    text="Accept this friend request"
                                >
                                    <Button
                                        onClick={() => {
                                            modifyFriendship({
                                                from_id: status.id,
                                                to_id: data.user.id,
                                                type: "request-accept",
                                                promiseKey: "requestAccept",
                                            });
                                        }}
                                    >
                                        {promiseStatus(promises.requestAccept)}
                                        <Image
                                            src="/checkmark.svg"
                                            width={12}
                                            height={12}
                                            alt="accept"
                                        />
                                        Accept
                                    </Button>
                                </Tooltip>

                                <Tooltip
                                    direction="top"
                                    text="Reject this friend request"
                                >
                                    <Button
                                        onClick={() => {
                                            modifyFriendship({
                                                from_id: status.id,
                                                to_id: data.user.id,
                                                type: "request-reject",
                                                promiseKey: "requestReject",
                                            });
                                        }}
                                    >
                                        {promiseStatus(promises.requestReject)}
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
                                        <Image
                                            src="/friends.svg"
                                            width={16}
                                            height={16}
                                            alt="sent"
                                        />
                                        Sent
                                    </Button>
                                </Tooltip>

                                <Tooltip
                                    direction="top"
                                    text="Unsend this request"
                                >
                                    <Button
                                        onClick={() => {
                                            modifyFriendship({
                                                from_id: status.id,
                                                to_id: data.user.id,
                                                type: "request-reject",
                                                promiseKey: "requestUnsend",
                                            });
                                        }}
                                    >
                                        {promiseStatus(promises.requestUnsend)}
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
                            <Tooltip
                                direction="top"
                                text="Send a friend request"
                            >
                                <Button
                                    onClick={() => {
                                        modifyFriendship({
                                            from_id: status.id,
                                            to_id: data.user.id,
                                            type: "request-send",
                                            promiseKey: "requestSend",
                                        });
                                    }}
                                >
                                    {promiseStatus(promises.requestSend)}
                                    <Image
                                        src="/plus.svg"
                                        width={16}
                                        height={16}
                                        alt="send"
                                    />
                                    Send
                                </Button>
                            </Tooltip>
                        ))}
                </div>
            </div>
        </div>
    );
};

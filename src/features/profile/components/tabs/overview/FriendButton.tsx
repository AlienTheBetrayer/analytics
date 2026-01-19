import { MessageBox } from "@/features/ui/messagebox/components/MessageBox";
import { usePopup } from "@/features/ui/popup/hooks/usePopup";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useMemo } from "react";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";

type Props = {
    data: { user: User; profile: Profile };
};

export const FriendButton = ({ data }: Props) => {
    //zustand
    const friendRequests = useAppStore((state) => state.friendRequests);
    const friends = useAppStore((state) => state.friends);
    const promises = useAppStore((state) => state.promises);
    const status = useAppStore((state) => state.status);
    const modifyFriendship = useAppStore((state) => state.modifyFriendship);

    // states
    // ui states
    const hasOutcomingRequest = useMemo(() => {
        return (
            status && friendRequests[status.id]?.outcoming?.has(data.user.id)
        );
    }, [friendRequests, status, data]);

    const hasIncomingRequest = useMemo(() => {
        return status && friendRequests[status.id]?.incoming?.has(data.user.id);
    }, [friendRequests, status, data]);

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

    return (
        status &&
        status.id !== data.user.id &&
        (friends[data.user.id]?.has(status.id) ||
            hasIncomingRequest ||
            hasOutcomingRequest) && (
            <div className="flex justify-center items-center w-full min-h-8">
                {unfriendMessageBox.render()}

                {friends[data.user.id]?.has(status.id) ? (
                    <Tooltip
                        direction="top"
                        text="Unfriend this user"
                    >
                        <Button
                            onClick={() => {
                                unfriendMessageBox.show();
                            }}
                        >
                            <PromiseStatus status={promises.unfriend} />
                            <Image
                                src="/unfriend.svg"
                                width={16}
                                height={16}
                                alt="unfriend"
                            />
                            Unfriend
                        </Button>
                    </Tooltip>
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
                                <PromiseStatus
                                    status={promises.requestAccept}
                                />
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
                                <PromiseStatus
                                    status={promises.requestReject}
                                />
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
                                <PromiseStatus
                                    status={promises.requestUnsend}
                                />
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
                            <PromiseStatus status={promises.requestSend} />
                            <Image
                                src="/plus.svg"
                                width={16}
                                height={16}
                                alt="send"
                            />
                            Send
                        </Button>
                    </Tooltip>
                )}
            </div>
        )
    );
};

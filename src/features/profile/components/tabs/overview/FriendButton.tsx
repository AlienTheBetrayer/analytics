import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import React from "react";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { PromiseState } from "@/promises/components/PromiseState";
import { useQuery } from "@/query/core";
import { modifyFriendship } from "@/query-api/calls/users";
import { wrapPromise } from "@/promises/core";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const FriendButton = ({ data }: Props) => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data: relationship } = useQuery({
        key: ["relationship", status?.id, data.id],
        trigger: !!status && status.id !== data.id,
    });

    // message boxes
    const unfriendBox = useMessageBox();

    if (!relationship) {
        return null;
    }

    // ui states
    const hasOutcomingRequest = relationship.sent;
    const hasIncomingRequest = relationship.received;
    const areFriends = relationship.friends;

    // not logged in or viewing own profile
    if (!status || status.id === data.id) {
        return null;
    }

    let component: React.ReactNode = null;

    // incoming request
    if (hasIncomingRequest) {
        component = (
            <>
                <li>
                    <Tooltip
                        direction="top"
                        text="Accept this friend request"
                    >
                        <Button
                            onClick={() => {
                                wrapPromise("requestAccept", () => {
                                    return modifyFriendship({
                                        from_id: status.id,
                                        to_id: data.id,
                                        type: "request-accept",
                                    });
                                });
                            }}
                        >
                            <PromiseState state="requestAccept" />
                            <Image
                                src="/checkmark.svg"
                                width={12}
                                height={12}
                                alt="accept"
                            />
                            Accept
                        </Button>
                    </Tooltip>
                </li>

                <li>
                    <Tooltip
                        direction="top"
                        text="Reject this friend request"
                    >
                        <Button
                            onClick={() => {
                                wrapPromise("requestReject", () => {
                                    return modifyFriendship({
                                        from_id: status.id,
                                        to_id: data.id,
                                        type: "request-reject",
                                    });
                                });
                            }}
                        >
                            <PromiseState state="requestReject" />
                            <Image
                                src="/cross.svg"
                                width={16}
                                height={16}
                                alt="reject"
                            />
                            Reject
                        </Button>
                    </Tooltip>
                </li>
            </>
        );

        // outcoming request
    } else if (hasOutcomingRequest) {
        component = (
            <>
                <li>
                    <Tooltip
                        direction="top"
                        text={`Wait for ${data.username} to respond`}
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
                </li>

                <li>
                    <Tooltip
                        direction="top"
                        text="Unsend this request"
                    >
                        <Button
                            onClick={() => {
                                wrapPromise("requestUnsend", () => {
                                    return modifyFriendship({
                                        from_id: status.id,
                                        to_id: data.id,
                                        type: "request-reject",
                                    });
                                });
                            }}
                        >
                            <PromiseState state="requestUnsend" />
                            <Image
                                src="/auth.svg"
                                width={16}
                                height={16}
                                alt="reject"
                            />
                            Cancel
                        </Button>
                    </Tooltip>
                </li>
            </>
        );

        // friends already
    } else if (areFriends) {
        component = (
            <li>
                <Tooltip
                    direction="top"
                    text="Unfriend this user"
                >
                    <Button
                        onClick={() => {
                            unfriendBox.show();
                        }}
                    >
                        <PromiseState state="unfriend" />
                        <Image
                            src="/unfriend.svg"
                            width={16}
                            height={16}
                            alt="unfriend"
                        />
                        Unfriend
                    </Button>
                </Tooltip>
            </li>
        );
        // send
    } else {
        component = (
            <li>
                <Tooltip
                    direction="top"
                    text="Send a friend request"
                >
                    <Button
                        onClick={() => {
                            wrapPromise("requestSend", () => {
                                return modifyFriendship({
                                    from_id: status.id,
                                    to_id: data.id,
                                    type: "request-send",
                                });
                            });
                        }}
                    >
                        <PromiseState state="requestSend" />

                        <Image
                            src="/plus.svg"
                            width={16}
                            height={16}
                            alt="send"
                        />
                        <Image
                            src="/friends.svg"
                            width={16}
                            height={16}
                            alt="request"
                        />
                        <span className="ml-1">Send</span>
                    </Button>
                </Tooltip>
            </li>
        );
    }

    if (!component) {
        return null;
    }

    return (
        <ul className="flex justify-center items-center w-full min-h-8 gap-2">
            {unfriendBox.render({
                children:
                    "You are about to delete this user from your friends!",
                onSelect: (res) => {
                    if (res === "yes" && status) {
                        wrapPromise("unfriend", () => {
                            return modifyFriendship({
                                from_id: status.id,
                                to_id: data.id,
                                type: "unfriend",
                            });
                        });
                    }
                },
            })}

            {component}
        </ul>
    );
};
